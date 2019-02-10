export class Objectif {
    id: number;
    title: string;
    date: string; //Format: DD/MM/YYYY
    category: string; //Format: #FFFFFF
    customCategory?: string;
    description: string;
    reportable: boolean;
    done: boolean;
    reportCount: number;
    importance: string;
    periodicity: string;
}