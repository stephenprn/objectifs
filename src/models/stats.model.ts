import { Objectif } from '@modelsPRN/objectif.model';

export class Stats {
    total: number = 0; //Number of objectives
    done: number = 0;
    reports: number = 0; //Number of reports made
    reported: number = 0; //Number of objectifs reported at least one time
    weekNbr?: number;
    categoriesUsage?: any;
    objectifs: Objectif[];

    getPropDone(): number {
        return Math.round(this.done*100/this.total);
    }

    isEmpty(): boolean {
        return this.total === 0;
    }
}