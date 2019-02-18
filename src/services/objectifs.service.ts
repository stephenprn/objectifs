import { Injectable } from '@angular/core';
import { Filter } from '@modelsPRN/filter.model';
import { Objectif } from '@modelsPRN/objectif.model';
import _ from 'lodash';

import { DateService } from './date.service';
import { SuggestionsService } from './suggestions.service';
import { daysInMonth } from 'ionic-angular/umd/util/datetime-util';
import { UiService } from './ui.service';

@Injectable()
export class ObjectifsService {
    objectifs: Objectif[];
    objectifsLater: any[];
    objectifsPeriodic: Objectif[];

    constructor(private suggestionsService: SuggestionsService, private dateService: DateService, 
        private uiService: UiService) { }

    private getId(periodic?: boolean): number {
        let nameStorage: string;

        if (!periodic) {
            nameStorage = 'id';
        } else {
            nameStorage = 'idPeriodic';
        }

        if (localStorage.getItem(nameStorage) == null) {
            localStorage.setItem(nameStorage, '1');
            return 1;
        }

        let nbr: number = Number(localStorage.getItem(nameStorage));
        nbr++;

        localStorage.setItem(nameStorage, nbr.toString());

        return nbr;
    }

    public add(objectif: Objectif): void {
        if (objectif.periodicity === 'punctual') {
            this.getAll();

            objectif.id = this.getId();
            delete objectif.periodicity;

            this.objectifs.push(objectif);
            this.suggestionsService.save(objectif.title);
            this.suggestionsService.incrementeCategory(objectif.category);

            this.saveChanges();
        } else {
            this.getAll(true);

            objectif.id = this.getId(true);

            this.objectifsPeriodic.push(objectif);
            this.suggestionsService.save(objectif.title);
            this.suggestionsService.incrementeCategory(objectif.category);

            this.saveChanges(true);

            objectif.idPeriodic = objectif.id;
            this.generateObjectifsPeriodic(objectif);

            this.saveChanges();
        }
    }

    public update(objectif: Objectif) {
        this.getAll();

        const objectifs: Objectif[] = this.filterObjectifs({ criteria: 'id', value: objectif.id, count: false });

        if (objectifs == null || objectifs.length === 0) {
            this.uiService.displayToast('Erreur lors de la modification de cet objectif, veuillez relancer l\'application');
            return;
        }

        objectifs[0] = _.cloneDeep(objectif);

        this.saveChanges();
    }

    private generateObjectifsPeriodic(objectifPeriodic: Objectif): void {
        let date: Date = this.dateService.getDateFromString(objectifPeriodic.date);
        let endDate: Date;
        let nbr: number;

        //Normally dateEndPeriodicity is never null but we never know...
        if (objectifPeriodic.dateEndPeriodicity != null) {
            endDate = this.dateService.getDateFromString(objectifPeriodic.dateEndPeriodicity);
        } else {
            endDate = _.cloneDeep(date);
            endDate.setMonth(endDate.getMonth() + 1);
        }

        if (objectifPeriodic.periodicityCustomNumber != null) {
            nbr = objectifPeriodic.periodicityCustomNumber;
        } else {
            nbr = 1;
        }

        //If we don't do this, the while miss one objectif at the end
        endDate.setDate(endDate.getDate() + 1);

        switch (objectifPeriodic.periodicity) {
            case 'daily':
                while (date < endDate) {
                    this.formatObjectifPeriodic(objectifPeriodic, date);
                    date.setDate(date.getDate() + nbr);
                }
                break;
            case 'weekly':
                while (date < endDate) {
                    this.formatObjectifPeriodic(objectifPeriodic, date);
                    date.setDate(date.getDate() + 7 * nbr);
                }
                break;
            case 'monthly':
                while (date < endDate) {
                    this.formatObjectifPeriodic(objectifPeriodic, date);
                    date.setMonth(date.getMonth() + nbr);
                }
                break;
            case 'customDays':
                const beginDate: Date = _.cloneDeep(date);

                while (date < endDate) {
                    objectifPeriodic.periodicityCustomDays.forEach((dayNbr: number) => {
                        const currentDay = date.getDay();
                        date.setDate(date.getDate() + dayNbr - currentDay);
                        if (date >= beginDate && date <= endDate) {
                            this.formatObjectifPeriodic(objectifPeriodic, date);
                        }
                    });

                    date = this.nextWeekdayDate(date, 1);
                }
                break;
        }
    }

    private formatObjectifPeriodic(objectifPeriodic: Objectif, date: Date): void {
        let objectif: Objectif = _.cloneDeep(objectifPeriodic);

        objectif.date = this.dateService.getStringFromDate(date);
        objectif.periodicity = 'punctual';
        delete objectif.dateEndPeriodicity;

        this.add(objectif);
    }

    private nextWeekdayDate(date, day_in_week): Date {
        // day_in_week: 1 (monday) - 7 (sunday)
        let ret: Date = new Date(date||new Date());
        ret.setDate(ret.getDate() + (day_in_week - 1 - ret.getDay() + 7) % 7 + 1);
        return ret;
      }

    public saveChanges(periodic?: boolean): void {
        if (!periodic) {
            localStorage.setItem('objectifs', JSON.stringify(this.objectifs));
        } else {
            localStorage.setItem('objectifsPeriodic', JSON.stringify(this.objectifsPeriodic));
        }
    }

    public getAll(periodic?: boolean): Objectif[] {
        let array: Objectif[];
        let nameStorage: string;

        if (!periodic) {
            nameStorage = 'objectifs';
            array = this.objectifs;
        } else {
            nameStorage = 'objectifsPeriodic';
            array = this.objectifsPeriodic;
        }

        if (array != null) {
            return array;
        }

        let objStorage: string = localStorage.getItem(nameStorage);

        if (!objStorage) {
            array = [];
        } else {
            array = JSON.parse(objStorage);
        }

        if (!periodic) {
            this.objectifs = array;
        } else {
            this.objectifsPeriodic = array;
        }

        return array;
    }

    public getNbrObjectifs(objectifs?: Objectif[]): number {
        if (!objectifs) {
            objectifs = this.getAll();
        }

        return objectifs.length;
    }

    public filterObjectifs(filter: Filter, objectifs?: Objectif[]): any {
        if (!objectifs) {
            objectifs = this.getAll();
        }

        let objs: Objectif[] = objectifs.filter((obj: Objectif) => {
            if (obj[filter.criteria] === filter.value) {
                return obj;
            }
        });

        return filter.count ? objs.length : objs;
    }
}