import { Injectable } from '@angular/core';
import { ObjectifsService } from './objectifs.service';
import { Objectif } from '../models/objectif.model';

@Injectable()
export class StatsService {
    constructor(private objectifsService: ObjectifsService) { }

    public getNumberDone(objectifs?: Objectif[]) {
        if (!objectifs) {
            objectifs = this.objectifsService.getAll();
        }

        let countDone: number = 0;

        objectifs.forEach((obj: Objectif) => {
            if (obj.done) countDone++; 
        });

        return countDone;
    }

    public getGlobalStats(): any {
        let stats: any = {};
    }
}