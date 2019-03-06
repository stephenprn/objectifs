import { Component } from '@angular/core';
import { AppConstants } from '@appPRN/app.constants';
import { NavController, NavParams } from 'ionic-angular';

import { WeekStatsPage } from './week-stats/week-stats.page';

@Component({
  selector: 'page-stats',
  templateUrl: 'stats.page.html',
})
export class StatsPage {
  tabs: any[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.tabs = [
      { page: WeekStatsPage, title: AppConstants.statsPages.weekStats.title }
    ];
  }

  ionViewDidLoad() { 
    console.log('ionViewDidLoad StatsPage');
  }

}
