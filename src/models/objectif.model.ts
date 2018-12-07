import { Importance } from "./importance.enum";

export class Objectif {
    id: number;
    title: string;
    date: string; //Format: DD/MM/YYYY
    color: string; //Format: #FFFFFF
    description: string;
    reportable: boolean;
    done: boolean;
    reportCount: number;
    importance: Importance;
}