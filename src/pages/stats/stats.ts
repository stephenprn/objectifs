import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { WeekStatsPage } from './weekStats/weekStats';
import { AppConstants } from '@appPRN/app.constants';

@Component({
  selector: 'page-stats',
  templateUrl: 'stats.html',
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
