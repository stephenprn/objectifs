import { Component } from "@angular/core";
import { StatsService } from "@servicesPRN/stats.service";
import {
  NavController,
  NavParams,
  ViewController
} from "ionic-angular";
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
