import { Component, ViewChild } from "@angular/core";
import { AppConstants } from "@appPRN/app.constants";
import { Objectif } from "@modelsPRN/objectif.model";
import { WeekStats } from "@modelsPRN/week-stats.model";
import { DateService } from "@servicesPRN/date.service";
import { ObjectifsService } from "@servicesPRN/objectifs.service";
import { StatsService } from "@servicesPRN/stats.service";
import {
  NavController,
  NavParams,
  Slides,
  ViewController
} from "ionic-angular";
import _ from "lodash";
import { Stats } from "@modelsPRN/stats.model";

@Component({
  selector: "page-general-stats",
  templateUrl: "general-stats.page.html"
})
export class GeneralStatsPage {
  stats: Stats;
  
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private statsService: StatsService
  ) {
    this.getStats();
  }

  dismissModal(): void {
    this.viewCtrl.dismiss(null);
  }

  private getStats(): void {
    this.stats = this.statsService.getStats(null, true, true);
  }
}
