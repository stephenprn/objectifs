import { Injectable } from '@angular/core';
import { AppConstants } from '@appPRN/app.constants';
import { AutoCompleteService } from '@componentsPRN/ionic2-auto-complete';
import { Storage } from '@ionic/storage';
import _ from 'lodash';

@Injectable()
export class SuggestionsService implements AutoCompleteService {
    suggestions: string[];
    categoriesUsages: any;

    constructor(private storage: Storage) { }

    public save(sug: string): void {
        this.suggestions.push(sug);
        this.storage.set(AppConstants.storageNames.suggestion.suggestion, this.suggestions);
    }

    public loadStored(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.storage.get(AppConstants.storageNames.suggestion.suggestion).then((suggestions: string[]) => {
                if (!suggestions) {
                    this.suggestions = [];
                } else {
                    this.suggestions = suggestions;
                }

                resolve();
            });
        });

    }

    public getResults(text: string): string[] {
        const textNormalized = text.normalize('NFD');

        return this.suggestions.filter((sug: string) => {
            if (sug.normalize('NFD').includes(textNormalized)) {
                return sug;
            }
        });
    }

    //Functions for the pre-selected category when the user add an objectif

    public incrementeCategory(id: string): void {
        this.categoriesUsages[id]++;
        this.storage.set(AppConstants.storageNames.suggestion.category, this.categoriesUsages);
    }

    public getCategoryMostUsed(): string {
        return _.maxBy(Object.keys(this.categoriesUsages), (id: string) => this.categoriesUsages[id]);
    }

    public getCategoriesUsages(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.categoriesUsages) {
                this.storage.get(AppConstants.storageNames.suggestion.category).then((categoriesUsages: any) => {
                    if (!categoriesUsages) {
                        this.categoriesUsages = {};

                        AppConstants.categories.forEach((cat: any) => {
                            this.categoriesUsages[cat.id] = 0;
                        });

                        this.storage.set(AppConstants.storageNames.suggestion.category, this.categoriesUsages);
                    } else {
                        this.categoriesUsages = categoriesUsages;
                    }

                    resolve();
                });
            } else {
                resolve();
            }
        });
    }
}