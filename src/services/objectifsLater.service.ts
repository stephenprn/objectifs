import { Injectable } from '@angular/core';
import { Objectif } from '../models/objectif.model';
import { Filter } from '../models/filter.model';

@Injectable()
export class ObjectifsLaterService {
    objectifsLater: any[];

    constructor() { }

    private getId(): number {
        if (localStorage.getItem('idLater') == null) {
            localStorage.setItem('idLater', '1');
            return 1;
        }

        let nbr: number = Number(localStorage.getItem('idLater'));
        nbr++;

        localStorage.setItem('idLater', nbr.toString());

        return nbr;
    }

    public getAll() {
        if (this.objectifsLater != null) {
            return this.objectifsLater;
        }

        const objStorage: string = localStorage.getItem('objectifsLater');

        if (!objStorage) {
            this.objectifsLater = [];
        } else {
            this.objectifsLater = JSON.parse(objStorage);
        }

        return this.objectifsLater;    
    }

    public saveChanges(): void {
        localStorage.setItem('objectifsLater', JSON.stringify(this.objectifsLater));
    }

    public add(objLater: any) {
        this.getAll();

        objLater.id = this.getId();

        this.objectifsLater.push(objLater);

        this.saveChanges();
    }

    public isListEmpty(): boolean {
        return this.getAll().length > 0 ? false: true;
    }

    public remove(id: number) {
        if (!this.objectifsLater) {
            this.getAll();
        }

        const index: number = this.objectifsLater.findIndex((obj: any) => {
            return obj.id === id;
        });

        console.log(index);

        if (index >= 0) {
            this.objectifsLater.splice(index, 1);
        }

        this.saveChanges();
    }
}