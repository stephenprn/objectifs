import { Injectable } from '@angular/core';
import { AppConstants } from '@appPRN/app.constants';
import { AutoCompleteService } from '@componentsPRN/ionic2-auto-complete';
import _ from 'lodash';

@Injectable()
export class SuggestionsService implements AutoCompleteService {
    suggestions: string[];
    categoriesUsages: any;

    constructor() { }

    public save(sug: string): void {
        this.getResults(null);

        this.suggestions.push(sug);

        localStorage.setItem(AppConstants.storageNames.suggestion.suggestion, JSON.stringify(this.suggestions));
    }

    public getResults(text: string): string[] {
        //text: text entered by the user. If null, we return all the results
        if (!this.suggestions) {
            let sugStorage: string = localStorage.getItem(AppConstants.storageNames.suggestion.suggestion);

            if (!sugStorage) {
                this.suggestions = [];
            } else {
                this.suggestions = JSON.parse(sugStorage);
            }
        }

        if (text === null) {
            return;
        }

        const textNormalized = text.normalize('NFD');

        return this.suggestions.filter((sug: string) => {
            if (sug.normalize('NFD').includes(textNormalized)) {
                return sug;
            }
        });
    }

    //Functions for the pre-selected category when the user add an objectif

    public incrementeCategory(id: string): void {
        this.getCategoriesUsages();
        this.categoriesUsages[id]++;
        localStorage.setItem(AppConstants.storageNames.suggestion.category, JSON.stringify(this.categoriesUsages));
    }

    public getCategoryMostUsed(): string {
        this.getCategoriesUsages();
        return _.maxBy(Object.keys(this.categoriesUsages), (id: string) => this.categoriesUsages[id]);
    }

    private getCategoriesUsages(): void {
        if (!this.categoriesUsages) {
            let catUsagesStorage: string = localStorage.getItem(AppConstants.storageNames.suggestion.category);

            if (!catUsagesStorage) {
                this.categoriesUsages = {};

                AppConstants.categories.forEach((cat: any) => {
                    this.categoriesUsages[cat.id] = 0;
                });

                localStorage.setItem(AppConstants.storageNames.suggestion.category, JSON.stringify(this.categoriesUsages));
            } else {
                this.categoriesUsages = JSON.parse(catUsagesStorage);
            }
        }
    }
}