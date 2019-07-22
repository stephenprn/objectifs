import { Injectable } from '@angular/core';
import { AppConstants } from '@appPRN/app.constants';
import { Storage } from '@ionic/storage';

@Injectable()
export class ObjectifsLaterService {
    objectifsLater: any[];

    constructor(private storage: Storage) { }

    private getId(): Promise<number> {
        return new Promise((resolve, reject) => {
            this.storage.get(AppConstants.storageNames.id.later).then((id: number) => {
                if (!id) {
                    id = 1;
                } else {
                    id++;
                }

                this.storage.set(AppConstants.storageNames.id.later, id);
                resolve(id);
            });
        });
    }

    public getAll(): any[] {
        return this.objectifsLater;
    }

    public loadStored(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            if (this.objectifsLater != null) {
                resolve(this.objectifsLater);
                return;
            }

            this.storage.get(AppConstants.storageNames.objectif.later).then((objectifsLater: any[]) => {
                if (!objectifsLater) {
                    this.objectifsLater = [];
                } else {
                    this.objectifsLater = objectifsLater;
                }

                resolve(this.objectifsLater);
            });
        });
    }

    public saveChanges(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.storage.set(AppConstants.storageNames.objectif.later, this.objectifsLater).then(() => {
                resolve();
            });
        })
    }

    public add(objLater: any): Promise<number> {
        return new Promise((resolve, reject) => {
            this.getId().then((id: number) => {
                objLater.id = id;
                this.objectifsLater.push(objLater);
                this.saveChanges();
                resolve(id);
            });
        });
    }

    public isListEmpty(): boolean {
        return !(this.objectifsLater.length > 0);
    }

    public remove(id: number): void {
        const index: number = this.objectifsLater.findIndex((obj: any) => {
            return obj.id === id;
        });

        if (index >= 0) {
            this.objectifsLater.splice(index, 1);
        }

        this.saveChanges();
    }

    public getNbr(): string {
        if (this.objectifsLater.length === 0) {
            return null;
        }

        if (this.objectifsLater.length >= 100) {
            return '99+';
        }

        return String(this.objectifsLater.length);
    }
}