import { Injectable } from '@angular/core';

@Injectable()
export class DateService {
    getStringFromDate(date: Date) {
        if (date == null) {
            date = new Date();
        }

        let str;
        date.getDate() < 10 ? str = '0' + date.getDate().toString() + '/' : str = date.getDate().toString() + '/';
        date.getMonth() < 9 ? (str += '0' + (date.getMonth() + 1)): str += date.getMonth() + 1;
        str += '/' + date.getFullYear();

        return str;
    }

    //From YYYY-MM-DD to DD/MM/YYYY
    reformatDate(date: string) {
        return date.split('-').reverse().join('/');
    }
}