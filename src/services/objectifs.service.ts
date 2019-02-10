import { Injectable } from '@angular/core';
import { Objectif } from '../models/objectif.model';
import { SuggestionsService } from './suggestions.service';
import { Filter } from '../models/filter.model';

@Injectable()
export class ObjectifsService {
    objectifs: Objectif[];
    objectifsLater: any[];
    objectifsPeriodic: Objectif[];

    constructor(private suggestionsService: SuggestionsService) { }

    private getId(periodic?: boolean): number {
        let nameStorage: string;

        if (!periodic) {
            nameStorage = 'id';
        } else {
            nameStorage = 'idPeriodic';
        }

        if (localStorage.getItem(nameStorage) == null) {
            localStorage.setItem(nameStorage, '1');
            return 1;
        }

        let nbr: number = Number(localStorage.getItem(nameStorage));
        nbr++;

        localStorage.setItem(nameStorage, nbr.toString());

        return nbr;
    }

    public add(objectif: Objectif): void {
        if (objectif.periodicity === 'punctual') {
            this.getAll();

            objectif.id = this.getId();

            this.objectifs.push(objectif);
            this.suggestionsService.save(objectif.title);
            this.suggestionsService.incrementeCategory(objectif.category);

            this.saveChanges();
        } else {
            this.getAll(true);

            objectif.id = this.getId(true);

            this.objectifsPeriodic.push(objectif);
            this.suggestionsService.save(objectif.title);
            this.suggestionsService.incrementeCategory(objectif.category);

            this.saveChanges(true);
        }
    }

    public saveChanges(periodic?: boolean): void {
        if (!periodic) {
            localStorage.setItem('objectifs', JSON.stringify(this.objectifs));
        } else {
            localStorage.setItem('objectifsPeriodic', JSON.stringify(this.objectifsPeriodic));
        }
    }

    public getAll(periodic?: boolean): Objectif[] {
        let array: Objectif[];
        let nameStorage: string;

        if (!periodic) {
            nameStorage = 'objectifs';
            array = this.objectifs;
        } else {
            nameStorage = 'objectifsPeriodic';
            array = this.objectifsPeriodic;
        }

        if (array != null) {
            return array;
        }

        let objStorage: string = localStorage.getItem(nameStorage);

        if (!objStorage) {
            array = [];
        } else {
            array = JSON.parse(objStorage);
        }

        if (!periodic) {
            this.objectifs = array;
        } else {
            this.objectifsPeriodic = array;
        }

        return array;
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