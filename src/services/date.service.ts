import { Injectable } from '@angular/core';

@Injectable()
export class DateService {
    getStringFromDate(date: Date): String {
        if (date == null) {
            date = new Date();
        }

        let str;
        date.getDate() < 10 ? str = '0' + date.getDate().toString() + '/' : str = date.getDate().toString() + '/';
        date.getMonth() < 9 ? (str += '0' + (date.getMonth() + 1)): str += date.getMonth() + 1;
        str += '/' + date.getFullYear();

        return str;
    }

    //From DD/MM/YYYY to Date object
    getDateFromString(str: String): Date {
        let array = str.split('/');
        return new Date(Number(array[2]), Number(array[1]) - 1, Number(array[0]));
    }

    //From YYYY-MM-DD to DD/MM/YYYY
    reformatDate(date: string): String {
        return date.split('-').reverse().join('/');
    }
}