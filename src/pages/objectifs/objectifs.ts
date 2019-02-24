import { Component, ViewChild } from '@angular/core';
import { AppConstants } from '@appPRN/app.constants';
import { DatePicker } from '@ionic-native/date-picker';
import { Day } from '@modelsPRN/day.model';
import { Objectif } from '@modelsPRN/objectif.model';
import { Stats } from '@modelsPRN/stats.model';
import { AddObjectifPage } from '@pagesPRN/addObjectif/addObjectif';
import { DateService } from '@servicesPRN/date.service';
import { ObjectifsService } from '@servicesPRN/objectifs.service';
import { ObjectifsLaterService } from '@servicesPRN/objectifsLater.service';
import { StatsService } from '@servicesPRN/stats.service';
import { UtilsService } from '@servicesPRN/utils.service';
import {
    ActionSheet,
    ActionSheetController,
    Alert,
    AlertController,
    FabContainer,
    Modal,
    ModalController,
    NavController,
    Slides,
} from 'ionic-angular';
import _ from 'lodash';
import { NotificationsService } from '@servicesPRN/notifications.service';


@Component({
    selector: 'page-objectifs',
    templateUrl: 'objectifs.html'
})
export class ObjectifsPage {
    @ViewChild(Slides) slides: Slides;

    objectifs: Objectif[];
    days: Day[];
    nbrDaysDisplayed: number;
    weekStats: Stats;
    categoriesJson: any;
    importancesJson: any;
    private week1: Date;
    limitDescription: number;
    bluredContent: boolean = false;
    bigSlides: boolean = true;
    dateFormat: string = AppConstants.dateFormat;
    // It's a string because it can be equal to '99+'
    nbrLater: string;
    updatingObj: boolean = false;

    constructor(public navCtrl: NavController, private objectifsService: ObjectifsService,
        public modalCtrl: ModalController, private dateService: DateService,
        public actionSheetCtrl: ActionSheetController, private datePicker: DatePicker,
        private statsService: StatsService, private alertCtrl: AlertController,
        private objectifsLaterService: ObjectifsLaterService, private utilsService: UtilsService,
        private notificationsService: NotificationsService) {
        this.categoriesJson = this.utilsService.getObjectFromArray('id', ['title', 'icon', 'color'], AppConstants.categories);
        this.importancesJson = this.utilsService.getObjectFromArray('id', ['icon', 'color', 'index', 'title'], AppConstants.importances);

        this.limitDescription = AppConstants.limitDescription;
        this.nbrDaysDisplayed = AppConstants.nbrDaysDisplayed;

        this.objectifs = this.objectifsService.getAll();
        this.initDays(null, null, null, true);
        //Useful for checkWeekStats() 
        this.week1 = new Date(new Date().getFullYear(), 0, 4);

        this.nbrLater = this.objectifsLaterService.getNbr();
    }

    initDays(addBegin: boolean, currentIndex: number, date?: Date, firstInit?: boolean): void {
        if (!date) {
            date = new Date();
        }

        let nbrDays: number;
        this.dateService.getCloseDays(date);

        //If addBegin is null, we totally reinitialize the days
        if (addBegin === null) {
            this.days = [];

            date.setDate(date.getDate() - this.nbrDaysDisplayed);

            nbrDays = 2 * this.nbrDaysDisplayed;
        } else {
            if (addBegin) {
                date = this.dateService.getDateFromString(this.days[0].date);
            } else {
                date = this.dateService.getDateFromString(this.days[this.days.length - 1].date);
            }

            nbrDays = this.nbrDaysDisplayed;
        }

        for (let i = 0; i < nbrDays; i++) {
            this.constructDay(addBegin, date);
        }

        //If we reinitialize completely the days, we must go to the right slide
        if (addBegin == null && currentIndex == null && !firstInit) {
            setTimeout(() => {
                this.slides.slideTo(this.nbrDaysDisplayed - 1, 0, false);
            });
        }

        //If we add days at the begining, the index of the current slide changed
        if (addBegin !== null && addBegin === true) {
            setTimeout(() => {
                this.slides.slideTo(currentIndex.valueOf() + this.nbrDaysDisplayed, 0, false);
            });
        }
    }

    private constructDay(addBegin: boolean, date: Date): void {
        if (addBegin === null || addBegin === false) {
            date.setDate(date.getDate() + 1);
        } else {
            date.setDate(date.getDate() - 1);
        }

        let day: Day = new Day();

        day.dateObject = _.cloneDeep(date);
        day.date = this.dateService.getStringFromDate(date);
        day.objectifs = this.objectifs.filter((obj: Objectif) => {
            return obj.date === day.date;
        });
        this.orderObjectives(day.objectifs);
        day.stats = this.statsService.getStats(day.objectifs);

        //We replace the date by yesterday, today or tomorrow
        if (addBegin === null) {
            this.dateService.checkCloseDay(day);
        }

        if (addBegin === null || addBegin === false) {
            this.days.push(day);
        } else {
            this.days.unshift(day);
        }
    }

    //Sort objectives by not done first and name
    orderObjectives(objs: Objectif[]): void {
        objs.sort((a: Objectif, b: Objectif) => {
            if (a.done && !b.done) {
                return 1;
            } else if (!a.done && b.done) {
                return -1;
            } else {
                if (this.importancesJson[a.importance].index > this.importancesJson[b.importance].index) {
                    return -1;
                } else if (this.importancesJson[a.importance].index < this.importancesJson[b.importance].index) {
                    return 1;
                } else {
                    return a.title.localeCompare(b.title);
                }
            }
        });
    }

    report(obj: Objectif): void {
        this.datePicker.show({
            date: this.dateService.getDateFromString(obj.date),
            mode: 'date',
            androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
        }).then(
            (date: Date) => {
                obj.reportCount++;

                this.notificationsService.delete(obj);
                obj.date = this.dateService.getStringFromDate(date);
                this.notificationsService.add(obj);

                this.objectifsService.saveChanges();
                this.initDays(null, null, date);
            },
            (err: any) => {
                console.log(err);
            }
        );
    }

    goToDay(initialDate: string): void {
        this.datePicker.show({
            date: this.dateService.getDateFromString(initialDate),
            mode: 'date',
            todayText: 'Aujourd\'hui',
            androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
        }).then(
            (date: Date) => {
                this.initDays(null, null, date);
            },
            (err: any) => {
                console.log(err);
            }
        );
    }

    setDone(obj: Objectif, done: boolean): void {
        obj.done = done;

        //Update number of objectives done
        if (done) {
            this.days[this.slides.getActiveIndex()].stats.done++;
            this.weekStats.done++;
        } else {
            this.days[this.slides.getActiveIndex()].stats.done--;
            this.weekStats.done--;
        }

        //Reorder objectives after status change
        this.orderObjectives(this.days[this.slides.getActiveIndex()].objectifs);
        this.objectifsService.saveChanges();
    }

    showActions(obj: Objectif): void {
        //Buttons that are displayed in the action sheet
        let buttons: any[] = [
            {
                text: 'Annuler',
                role: 'cancel'
            }
        ];

        if (!obj.done) {
            buttons.unshift({
                text: 'Modifier',
                handler: () => {
                    this.updatingObj = true;
                    this.showUpdate(obj);
                    return true;
                }
            })
        }

        if (obj.reportable) {
            buttons.unshift({
                text: 'Reporter',
                handler: () => {
                    this.report(obj);
                    return true;
                }
            });
        }

        if (obj.done) {
            buttons.unshift({
                text: 'Objectif non-atteint...',
                handler: () => {
                    this.setDone(obj, false);
                }
            })
        } else {
            buttons.unshift({
                text: 'Objectif atteint !',
                handler: () => {
                    this.setDone(obj, true);
                }
            })
        }

        const actionSheet: ActionSheet = this.actionSheetCtrl.create({
            title: obj.title,
            buttons: buttons
        });

        actionSheet.onWillDismiss(() => {
            if (!this.updatingObj) {
                this.bluredContent = false;
            }
        });

        this.bluredContent = true;

        actionSheet.present();
    }

    setBluredContent(): void {
        this.bluredContent = !this.bluredContent;
    }

    showAdd(event: any, fab: FabContainer): void {
        //Get the date of the current slide and convert it to format YYYY-MM-DD
        const date: string = this.dateService.formatDateString(this.days[this.slides.getActiveIndex()].date, true);
        const modal: Modal = this.modalCtrl.create(AddObjectifPage, { date: date });

        modal.present();

        if (fab) {
            fab.close();
        }

        modal.onDidDismiss((obj: Objectif) => {
            this.bluredContent = false;

            if (obj != null) {
                const date: Date = this.dateService.getDateFromString(obj.date);
                this.initDays(null, null, date);
                this.nbrLater = this.objectifsLaterService.getNbr();
            }
        })
    }

    showUpdate(objectif: Objectif) {
        const alert: Alert = this.alertCtrl.create({
            title: 'Modifier un objectif',
            inputs: [
                {
                    name: 'title',
                    placeholder: 'Titre',
                    value: objectif.title
                },
                {
                    name: 'description',
                    placeholder: 'Description',
                    value: objectif.description
                }
            ],
            buttons: [
                {
                    text: 'Annuler'
                },
                {
                    text: 'Sauvegarder',
                    handler: (data: any) => {
                        objectif.title = data.title;
                        objectif.description = data.description;
                        this.objectifsService.update(objectif);
                    }
                }
            ]
        });

        alert.onWillDismiss(() => {
            this.bluredContent = false;
        });

        alert.present();
    }

    showAddLater(event: any, fab: FabContainer): void {
        const alert: Alert = this.alertCtrl.create({
            title: 'Ajouter pour plus tard',
            message: 'Objectif que vous pourrez programmer plus tard',
            inputs: [
                {
                    name: 'title',
                    placeholder: 'Titre'
                },
                {
                    name: 'description',
                    placeholder: 'Description'
                }
            ],
            buttons: [
                {
                    text: 'Annuler'
                },
                {
                    text: 'Sauvegarder',
                    handler: (data: any) => {
                        this.objectifsLaterService.add(data);
                        this.nbrLater = this.objectifsLaterService.getNbr();
                    }
                }
            ]
        });

        alert.onWillDismiss(() => {
            this.bluredContent = false;
        });

        alert.present();
        fab.close();
    }

    slideDidChange(): void {
        this.checkWeekStats();
        const currentIndex: number = this.slides.getActiveIndex();

        if (currentIndex == null) {
            return;
        }

        if (currentIndex < AppConstants.indexTriggerCache) {
            this.initDays(true, currentIndex);
        } else if (currentIndex >= this.days.length - AppConstants.indexTriggerCache) {
            this.initDays(false, null);
        }
    }

    checkWeekStats(reset?: boolean, date?: Date): void {
        //Get week from the current day
        if (!date) {
            date = this.dateService.getDateFromString(this.days[this.slides.getActiveIndex()].date);
        }

        date.setDate(date.getDate() - (date.getDay() + 6) % 7);

        const weekNbr: number = 1 + Math.round(((date.getTime() - this.week1.getTime()) / 86400000
            - 3 + (this.week1.getDay() + 6) % 7) / 7);

        if (!reset && this.weekStats && this.weekStats.weekNbr === weekNbr) {
            return;
        }

        //The list of the objectives of the current week
        let objectifs: Objectif[] = [];

        for (let i = 0; i <= 6; i++) {
            for (let j = 0; j < this.days.length; j++) {
                const dateStr: string = this.dateService.getStringFromDate(date);
                if (this.days[j].date === dateStr) {
                    objectifs = objectifs.concat(this.days[j].objectifs);
                    break;
                }
            }

            date.setDate(date.getDate() + 1);
        }

        this.weekStats = this.statsService.getStats(objectifs);
        this.weekStats.weekNbr = weekNbr;

        if (this.weekStats.isEmpty()) {
            this.bigSlides = true;
        } else {
            this.bigSlides = false;
        }
    }
}
