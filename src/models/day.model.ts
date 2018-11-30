import { Objectif } from "./objectif.model";
import { Stats } from "./stats.model";

export class Day {
    date: string;
    objectifs: Objectif[] = [];
    stats?: Stats;
    name?: string;
};