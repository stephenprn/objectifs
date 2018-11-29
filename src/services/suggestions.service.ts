import { Injectable } from "@angular/core";
import { AutoCompleteService } from "ionic2-auto-complete";

@Injectable()
export class SuggestionsService implements AutoCompleteService {
    suggestions: string[];

    constructor() { }

    public save(sug: string) {
        this.getResults(null);

        this.suggestions.push(sug);

        localStorage.setItem('suggestions', JSON.stringify(this.suggestions));
    }

    public getResults(text: string): string[] {
        //text: text entered by the user. If null, we return all the results
        if (!this.suggestions) {
            let sugStorage: string = localStorage.getItem('suggestions');

            if (!sugStorage) {
                this.suggestions = [];
            } else {
                this.suggestions = JSON.parse(sugStorage);
            }
        }

        if (text === null) {
            return;
        }

        let textNormalized = text.normalize('NFD');

        return this.suggestions.filter((sug: string) => {
            if (sug.normalize('NFD').includes(textNormalized)) {
                return sug;
            }
        });
    }
}