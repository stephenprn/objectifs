import { Component, Input } from '@angular/core';
import { AppConstants } from '@appPRN/app.constants';
import { Stats } from '@modelsPRN/stats.model';

@Component({
    selector: 'stats-card',
    templateUrl: 'week-stats-home.component.html'
})
export class weekStatsHomeComponent {
    @Input('stats') stats: Stats;
    colors: any;

    constructor() {
        this.colors = AppConstants.colors;
    }
}