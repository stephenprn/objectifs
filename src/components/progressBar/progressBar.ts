import { Component, Input, OnChanges } from "@angular/core";
import { AppConstants } from '../../app/app.constants';

@Component({
    selector: 'progress-bar',
    templateUrl: 'progressBar.html'
})
export class ProgressBarComponent implements OnChanges {
    @Input('progress') progress: number;
    colors: any[];
    color: string;

    constructor() {
        this.colors = AppConstants.progressBarColors;
    }

    ngOnChanges(changes) {
        for (let i = 0; i < this.colors.length; i++) {
            if (this.progress <= this.colors[i].value) {
                this.color = this.colors[i].color;
                break;
            }
        }
    }
}