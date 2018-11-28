import { Injectable } from "@angular/core";

@Injectable()
export class SuggestionsService {
    suggestions: string[];

    constructor() { }

    public save(sug: string) {
        this.filter(null);

        this.suggestions.push(sug);

        localStorage.setItem('suggestions', JSON.stringify(this.suggestions));
    }

    public filter(text: string): string[] {
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
            sug.normalize('NFD').includes(textNormalized);
        });
    }
}