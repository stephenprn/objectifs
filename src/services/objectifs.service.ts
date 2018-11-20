import { Injectable } from '@angular/core';

@Injectable()
export class ObjectifsService {
    objectifs: any[];

    constructor() { }

    add(objectif: any) {
        if (!this.objectifs) {
            this.getAll();
        }

        this.objectifs.push(objectif);

        localStorage.setItem('objectifs', JSON.stringify(this.objectifs));
    }

    getAll() {
        let objStorage = localStorage.getItem('objectifs');

        if (!objStorage) {
            this.objectifs = [];
        } else {
            this.objectifs = JSON.parse(objStorage);
        }
        
        return this.objectifs;
    }
}