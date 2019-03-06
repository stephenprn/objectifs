import { Component, ViewChild } from '@angular/core';
import { AppConstants } from '@appPRN/app.constants';
import { Objectif } from '@modelsPRN/objectif.model';
import { WeekStats } from '@modelsPRN/week-stats.model';
import { DateService } from '@servicesPRN/date.service';
import { ObjectifsService } from '@servicesPRN/objectifs.service';
import { StatsService } from '@servicesPRN/stats.service';
import { NavController, NavParams, Slides, ViewController } from 'ionic-angular';
import _ from 'lodash';

@Component({
  selector: 'page-week-stats',
  templateUrl: 'week-stats.page.html',
})
export class WeekStatsPage {
  weekStats: WeekStats[];
  @ViewChild(Slides) slides: Slides;
  nbrWeeksDisplayed: number;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private dateService: DateService, private objectifsService: ObjectifsService,
    private statsService: StatsService, private viewCtrl: ViewController) {
    this.nbrWeeksDisplayed = AppConstants.nbrWeeksDisplayed;
    this.initWeek(null, null, this.navParams.get('date'), true);
  }

  private initWeek(addBegin: boolean, currentIndex: number, date?: Date, firstInit?: boolean): void {
    if (!date) {
      date = new Date();
    }

    let nbrWeeks: number;

    if (addBegin === null) {
      this.weekStats = [];

      date.setDate(date.getDate() - 7 * this.nbrWeeksDisplayed);

      nbrWeeks = 2 * this.nbrWeeksDisplayed;
    } else {
      if (addBegin) {
        date = this.dateService.getDateFromString(this.weekStats[0].monday);
      } else {
        date = this.dateService.getDateFromString(this.weekStats[this.weekStats.length - 1].monday);
      }

      nbrWeeks = this.nbrWeeksDisplayed;
    }

    for (let i = 0; i < nbrWeeks; i++) {
      if (addBegin === null || addBegin === false) {
        date.setDate(date.getDate() + 7);
        this.weekStats.push(this.getStats(date));
      } else {
        date.setDate(date.getDate() - 7);
        this.weekStats.unshift(this.getStats(date));
      }
    }

    // If we reinitialize completely the days, we must go to the right slide
    if (addBegin == null && currentIndex == null && !firstInit) {
      setTimeout(() => {
        this.slides.slideTo(this.nbrWeeksDisplayed - 1, 0, false);
      });
    }

    // If we add days at the begining, the index of the current slide changed
    if (addBegin !== null && addBegin === true) {
      setTimeout(() => {
        this.slides.slideTo(currentIndex.valueOf() + this.nbrWeeksDisplayed, 0, false);
      });
    }
  }

  slideDidChange(): void {
    const currentIndex: number = this.slides.getActiveIndex();

    if (currentIndex == null) {
      return;
    }

    if (currentIndex < AppConstants.indexTriggerCache) {
      this.initWeek(true, currentIndex);
    } else if (currentIndex >= this.weekStats.length - AppConstants.indexTriggerCache) {
      this.initWeek(false, null);
    }
  }

  private getStats(date: Date): WeekStats {
    // Get monday and sunday of the week of the date
    let monday: Date = this.dateService.getMonday(date);
    let sunday: Date = _.cloneDeep(monday);
    sunday.setDate(sunday.getDate() + 6);

    const objectifs: Objectif[] = this.objectifsService.filterObjectifs([
      { criteria: 'date', value: '>=DATE' + AppConstants.separator + this.dateService.getStringFromDate(monday), custom: true },
      { criteria: 'date', value: '<=DATE' + AppConstants.separator + this.dateService.getStringFromDate(sunday), custom: true }
    ]);

    let weekStats: WeekStats = new WeekStats();

    weekStats.stats = this.statsService.getStats(objectifs);
    weekStats.monday = this.dateService.getStringFromDate(monday);

    this.dateService.checkCloseWeek(weekStats);

    return weekStats;
  }

  dismissModal(): void {
    this.viewCtrl.dismiss(null);
}
}
