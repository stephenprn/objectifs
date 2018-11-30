import { Injectable } from '@angular/core';
import { ObjectifsService } from './objectifs.service';
import { Objectif } from '../models/objectif.model';
import { Stats } from '../models/stats.model';

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

    public getStats(objectifs?: Objectif[]): any {
        if (!objectifs) {
            objectifs = this.objectifsService.getAll();
        }

        let stats: Stats = new Stats();

        stats.total = objectifs.length;

        objectifs.forEach((obj: Objectif) => {
            if (obj.done) {
                stats.done++;
            }

            if (stats.reports > 0) {
                stats.reports += obj.reportCount;
                stats.reported++;
            }
        });

        return stats;
    }
}