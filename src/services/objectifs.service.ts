import { Injectable } from '@angular/core';
import { Objectif } from '../models/objectif.model';
import { SuggestionsService } from './suggestions.service';

@Injectable()
export class ObjectifsService {
    objectifs: Objectif[];

    constructor(private suggestionsService: SuggestionsService) { }

    private getId(): number {
        if (localStorage.getItem('id') == null) {
            localStorage.setItem('id', '1');
            return 1;
        }

        let nbr: number = Number(localStorage.getItem('id'));
        nbr++;

        localStorage.setItem('id', nbr.toString());

        return nbr;
    }

    // public report(objectif: any) {
    //     this.objectifs.find((obj: any) => {
    //         return obj.id === objectif.id;
    //     });
    // }

    public add(objectif: Objectif): void {
        if (!this.objectifs) {
            this.getAll();
        }

        objectif.id = this.getId();

        this.objectifs.push(objectif);
        this.suggestionsService.save(objectif.title);

        this.saveChanges();
    }

    public saveChanges(): void {
        localStorage.setItem('objectifs', JSON.stringify(this.objectifs));
    }

    public getAll(): Objectif[] {
        let objStorage: string = localStorage.getItem('objectifs');

        if (!objStorage) {
            this.objectifs = [];
        } else {
            this.objectifs = JSON.parse(objStorage);
        }

        return this.objectifs;
    }
}