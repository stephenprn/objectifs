import { Injectable } from '@angular/core';
import { Day } from '@modelsPRN/day.model';
import * as _ from 'lodash';

@Injectable()
export class DateService {
    closeDays: any = null;

    constructor() { }

    //From Date object to DD/MM/YYYY
    public getStringFromDate(date: Date, reformat?: boolean): string {
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

    // Initialize date for periodic objectifs (format: YYYY-MM-DD)
    public initDatePeriodic(date: string): string {
        let array: string[] = date.split('-');
        let month = Number(array[1]) + 1;

        if (month >= 10) {
            return array[0] + '-' + month + '-' + array[2];
        }

        return array[0] + '-0' + month + '-' + array[2];
    }

    // Add months to date (format: DD/MM/YYYY)
    public addMonths(date: string, number?: number): string {
        if (!number) {
            number = 1;
        }

        let array: string[] = date.split('/');
        let month = Number(array[1]) + number;

        if (month >= 10) {
            return array[0] + '/' + month + '/' + array[2];
        }

        return array[0] + '/0' + month + '/' + array[2];
    }

    // From DD/MM/YYYY (YYYY-MM-DD if inverse === true) to Date object
    public getDateFromString(str: string, inverse?: boolean): Date {
        if (!inverse) {
            const array: string[] = str.split('/');
            return new Date(Number(array[2]), Number(array[1]) - 1, Number(array[0]), 0, 0, 0, 0);
        } else {
            const array: string[] = str.split('-');
            return new Date(Number(array[0]), Number(array[1]) - 1, Number(array[2]), 0, 0, 0, 0);
        }
    }

    // From YYYY-MM-DD to DD/MM/YYYY or DD/MM/YYYY to YYYY-MM-DD if inverse = true
    public formatDateString(date: string, inverse?: boolean): string {
        if (inverse) {
            return date.split('/').reverse().join('-');
        }

        return date.split('-').reverse().join('/');
    }

    // Return yesterday's, today's and tomorrow's date in format DD/MM/YYYY
    public getCloseDays(date: Date): void {
        if (this.closeDays !== null) {
            return;
        }

        this.closeDays = {};
        let dateClone = _.cloneDeep(date);

        this.closeDays.today = this.getStringFromDate(dateClone);
        dateClone.setDate(date.getDate() - 1);
        this.closeDays.yesterday = this.getStringFromDate(dateClone);
        dateClone.setDate(date.getDate() + 1);
        this.closeDays.tomorrow = this.getStringFromDate(dateClone);
    }

    public checkCloseDay(day: Day): void {
        switch (day.date) {
            case this.closeDays.today: {
                day.name = 'Aujourd\'hui';
                break;
            }
            case this.closeDays.yesterday: {
                day.name = 'Hier';
                break;
            }
            case this.closeDays.tomorrow: {
                day.name = 'Demain';
                break;
            }
        }
    }
}