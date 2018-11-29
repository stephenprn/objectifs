import { Injectable } from '@angular/core';
import * as _ from 'lodash';

@Injectable()
export class DateService {
    //From Date object to DD/MM/YYYY
    getStringFromDate(date: Date, reformat?: boolean): string {
        if (date == null) {
            date = new Date();
        }

        let str: string;
        date.getDate() < 10 ? str = '0' + date.getDate().toString() + '/' : str = date.getDate().toString() + '/';
        date.getMonth() < 9 ? (str += '0' + (date.getMonth() + 1)) : str += date.getMonth() + 1;
        str += '/' + date.getFullYear();

        if (reformat) {
            str = this.formatDateString(str);
        }

        return str;
    }

    //From DD/MM/YYYY to Date object
    getDateFromString(str: string): Date {
        let array: string[] = str.split('/');
        return new Date(Number(array[2]), Number(array[1]) - 1, Number(array[0]));
    }

    //From YYYY-MM-DD to DD/MM/YYYY or DD/MM/YYYY to YYYY-MM-DD if inverse = true
    formatDateString(date: string, inverse?: boolean): string {
        if (inverse) {
            return date.split('/').reverse().join('-');
        }

        return date.split('-').reverse().join('/');
    }

    //Return yesterday's, today's and tomorrow's date in format DD/MM/YYYY
    getCloseDays(date: Date): any {
        let days: any = {};
        let dateClone = _.cloneDeep(date);

        days.today = this.getStringFromDate(dateClone);
        dateClone.setDate(date.getDate() - 1);
        days.yesterday = this.getStringFromDate(dateClone);
        dateClone.setDate(date.getDate() + 1);
        days.tomorrow = this.getStringFromDate(dateClone);

        return days;
    }
}