import { Component, Input } from "@angular/core";

@Component({
    selector: 'progress-bar',
    templateUrl: 'progressBar.html'
})
export class ProgressBarComponent {
    @Input('progress') progress: number;

    constructor() {
        
    }
}