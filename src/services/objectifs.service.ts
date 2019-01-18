import { Injectable } from '@angular/core';
import { Objectif } from '../models/objectif.model';
import { SuggestionsService } from './suggestions.service';
import { Filter } from '../models/filter.model';

@Injectable()
export class ObjectifsService {
    objectifs: Objectif[];
    objectifsLater: any[];

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

    public add(objectif: Objectif): void {
        this.getAll();

        objectif.id = this.getId();

        this.objectifs.push(objectif);
        this.suggestionsService.save(objectif.title);
        this.suggestionsService.incrementeCategory(objectif.category);

        this.saveChanges();
    }

    public saveChanges(): void {
        localStorage.setItem('objectifs', JSON.stringify(this.objectifs));
    }

    public getAll(): Objectif[] {
        if (this.objectifs != null) {
            return this.objectifs;
        }

        const objStorage: string = localStorage.getItem('objectifs');

        if (!objStorage) {
            this.objectifs = [];
        } else {
            this.objectifs = JSON.parse(objStorage);
        }

        return this.objectifs;
    }

    public getNbrObjectifs(objectifs?: Objectif[]): number {
        if (!objectifs) {
            objectifs = this.getAll();
        }

        return objectifs.length;
    }

    public filterObjectifs(filter: Filter, objectifs?: Objectif[]): any {
        if (!objectifs) {
            objectifs = this.getAll();
        }

        let objs: Objectif[] = objectifs.filter((obj: Objectif) => {
            if (obj[filter.criteria] === filter.value) {
                return obj;
            }
        });

        return filter.count ? objs.length : objs; 
    }
}