import { Injectable } from '@angular/core';
import { AppConstants } from '@appPRN/app.constants';

@Injectable()
export class ObjectifsLaterService {
    objectifsLater: any[];

    constructor() { }

    private getId(): number {
        if (localStorage.getItem(AppConstants.storageNames.id.later) == null) {
            localStorage.setItem(AppConstants.storageNames.id.later, '1');
            return 1;
        }

        let nbr: number = Number(localStorage.getItem(AppConstants.storageNames.id.later));
        nbr++;

        localStorage.setItem(AppConstants.storageNames.id.later, nbr.toString());

        return nbr;
    }

    public getAll(): any[] {
        if (this.objectifsLater != null) {
            return this.objectifsLater;
        }

        const objStorage: string = localStorage.getItem(AppConstants.storageNames.objectif.later);

        if (!objStorage) {
            this.objectifsLater = [];
        } else {
            this.objectifsLater = JSON.parse(objStorage);
        }

        return this.objectifsLater;    
    }

    public saveChanges(): void {
        localStorage.setItem(AppConstants.storageNames.objectif.later, JSON.stringify(this.objectifsLater));
    }

    public add(objLater: any): void {
        this.getAll();

        objLater.id = this.getId();

        this.objectifsLater.push(objLater);

        this.saveChanges();
    }

    public isListEmpty(): boolean {
        return this.getAll().length > 0 ? false: true;
    }

    public remove(id: number): void {
        this.getAll();

        const index: number = this.objectifsLater.findIndex((obj: any) => {
            return obj.id === id;
        });

        if (index >= 0) {
            this.objectifsLater.splice(index, 1);
        }

        this.saveChanges();
    }

    public getNbr(): string {
        this.getAll();

        if (this.objectifsLater.length === 0) {
            return null;
        }

        if (this.objectifsLater.length >= 100) {
            return '99+';
        }

        return String(this.objectifsLater.length);
    }
}