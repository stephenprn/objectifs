import { Objectif } from "@modelsPRN/objectif.model";
import { Stats } from "@modelsPRN/stats.model";


export class Day {
    date: string;
    objectifs: Objectif[] = [];
    stats?: Stats;
    name?: string;
    dateObject?: Date;
}