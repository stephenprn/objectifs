import { Injectable } from '@angular/core';

@Injectable()
export class DateService {
    getStringFromDate(date: Date): string {
        if (date == null) {
            date = new Date();
        }

        let str: string;
        date.getDate() < 10 ? str = '0' + date.getDate().toString() + '/' : str = date.getDate().toString() + '/';
        date.getMonth() < 9 ? (str += '0' + (date.getMonth() + 1)): str += date.getMonth() + 1;
        str += '/' + date.getFullYear();

        return str;
    }

    //From DD/MM/YYYY to Date object
    getDateFromString(str: string): Date {
        let array: string[] = str.split('/');
        return new Date(Number(array[2]), Number(array[1]) - 1, Number(array[0]));
    }

    //From YYYY-MM-DD to DD/MM/YYYY
    reformatDate(date: string): string {
        return date.split('-').reverse().join('/');
    }
}