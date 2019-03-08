import { Component, Input, OnInit } from '@angular/core';
import { AppConstants } from '@appPRN/app.constants';
import { Stats } from '@modelsPRN/stats.model';
import { Category } from '@modelsPRN/category.model';
import _ from 'lodash';

@Component({
    selector: 'stats-card',
    templateUrl: 'week-stats-home.component.html'
})
export class weekStatsHomeComponent implements OnInit {
    @Input('stats') stats: Stats;
    colors: any;
    categories: Category[] = [];
    weekStatsPage: boolean = false;

    constructor() {
        this.colors = AppConstants.colors;
    }

    ngOnInit(): void {
        this.constructCategories();
    }

    private constructCategories() {
        if (this.stats == null || this.stats.categoriesUsage == null) {
            return;
        } else {
            this.weekStatsPage = true;
        }

        AppConstants.categories.forEach((category: Category) => {
            if (this.stats.categoriesUsage[category.id] != null) {
                let cat: Category = _.cloneDeep(category);
                cat.number = this.stats.categoriesUsage[category.id];
                this.categories.push(cat);
            }
        });

        this.sortCategories();
    }

    private sortCategories() {
        this.categories.sort((a: Category, b: Category) => {
            if (a.number.total > b.number.total) {
                return -1;
            } else if (a.number.total < b.number.total) {
                return 1;
            } else if (a.title > b.title) {
                return 1;
            } else {
                return -1;
            }
        });
    }
}