import { Injectable } from '@angular/core';

@Injectable()
export class ObjectifsService {
    objectifs: any[];

    constructor() { }

    private getId(): number {
        if (localStorage.getItem('id') == null) {
            localStorage.setItem('id', '1');
            return 1;
        }

        let nbr = Number(localStorage.getItem('id'));
        nbr++;

        localStorage.setItem('id', nbr.toString());

        return nbr;
    }

    // public report(objectif: any) {
    //     this.objectifs.find((obj: any) => {
    //         return obj.id === objectif.id;
    //     });
    // }

    public add(objectif: any): void {
        if (!this.objectifs) {
            this.getAll();
        }

        objectif.id = this.getId();

        this.objectifs.push(objectif);

        this.saveChanges();
    }

    public saveChanges(): void {
        localStorage.setItem('objectifs', JSON.stringify(this.objectifs));
    }

    public getAll(): any[] {
        let objStorage = localStorage.getItem('objectifs');

        if (!objStorage) {
            this.objectifs = [];
        } else {
            this.objectifs = JSON.parse(objStorage);
        }

        return this.objectifs;
    }
}