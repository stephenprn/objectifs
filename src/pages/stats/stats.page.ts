import { ViewController } from "ionic-angular";
import { Component } from "@angular/core";
import { AppConstants } from "@appPRN/app.constants";
import { NavController, NavParams } from "ionic-angular";

import { WeekStatsPage } from "./week-stats/week-stats.page";
import { GeneralStatsPage } from "./general-stats/general-stats.page";

@Component({
  selector: "page-stats",
  templateUrl: "stats.page.html"
})
export class StatsPage {
  tabs: any[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController
  ) {
    this.tabs = [
      { page: WeekStatsPage, title: AppConstants.statsPages.weekStats.title },
      {
        page: GeneralStatsPage,
        title: AppConstants.statsPages.generalStats.title
      }
    ];
  }

  ionViewDidLoad() {}

  dismissModal(): void {
    this.viewCtrl.dismiss(null);
  }
}
