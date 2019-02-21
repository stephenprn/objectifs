import { Injectable } from '@angular/core';
import { Objectif } from '@modelsPRN/objectif.model';

@Injectable()
export class UtilsService {
    constructor() { }

    public getObjectFromArray(key: string, values: string[], array: any[]): any {
        let object: any = {};

        array.forEach((elt: any) => {
            let eltJson: any = {};

            values.forEach((val: string) => {
                eltJson[val] = elt[val];
            });

            object[elt[key]] = eltJson;
        });

        return object;
    }
}