import { Component, Input } from "@angular/core";
import { AppConstants } from '../../app/app.constants';
import { Stats } from "../../models/stats.model";

@Component({
    selector: 'week-stats-home',
    templateUrl: 'weekStatsHome.html'
})
export class weekStatsHomeComponent {
    @Input('stats') stats: Stats;
    colors: any;

    constructor() {
        this.colors = AppConstants.colors;
    }
}