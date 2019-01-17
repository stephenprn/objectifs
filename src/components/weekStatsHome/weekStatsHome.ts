import { Component, Input, OnChanges } from "@angular/core";
import { AppConstants } from '../../app/app.constants';
import { Stats } from "../../models/stats.model";

@Component({
    selector: 'week-stats-home',
    templateUrl: 'weekStatsHome.html'
})
export class weekStatsHomeComponent implements OnChanges {
    @Input('stats') stats: Stats;

    constructor() {
    }

    ngOnChanges(changes) {
    }
}