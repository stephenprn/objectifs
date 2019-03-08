import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { AppConstants } from '@appPRN/app.constants';

@Component({
    selector: 'progress-bar',
    templateUrl: 'progress-bar.component.html'
})
export class ProgressBarComponent implements OnChanges, OnInit {
    @Input('progress') progress: number;
    width: number;
    colors: any[];
    color: string;

    constructor() {
        this.colors = AppConstants.progressBarColors;
    }

    ngOnChanges(changes): void {
        for (let i = 0; i < this.colors.length; i++) {
            if (this.progress <= this.colors[i].value) {
                this.color = this.colors[i].color;
                this.width = this.progress;
                break;
            }
        }
    }

    ngOnInit(): void {
        // To animate when the component is initialized for the first time
        this.width = 0;
        setTimeout(() => {
            this.width = this.progress;
        });
    }
}