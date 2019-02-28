import { Injectable } from '@angular/core';
import { Objectif } from '@modelsPRN/objectif.model';
import { Stats } from '@modelsPRN/stats.model';

import { ObjectifsService } from './objectifs.service';

@Injectable()
export class StatsService {
    constructor(private objectifsService: ObjectifsService) { }

    public getNumberDone(objectifs?: Objectif[]): number {
        if (!objectifs) {
            objectifs = this.objectifsService.getAll();
        }

        let countDone: number = 0;

        objectifs.forEach((obj: Objectif) => {
            if (obj.done) countDone++;
        });

        return countDone;
    }

    public getStats(objectifs?: Objectif[]): Stats {
        if (objectifs == null) {
            objectifs = this.objectifsService.getAll();
        }

        let stats: Stats = new Stats();

        stats.total = objectifs.length;

        objectifs.forEach((obj: Objectif) => {
            if (obj.done) {
                stats.done++;
            }

            if (obj.reportCount > 0) {
                stats.reports += obj.reportCount;
                stats.reported++;
            }
        });

        return stats;
    }
}