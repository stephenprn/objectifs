import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { NavController, ModalController, ActionSheetController, Slides, Modal, AlertController, Alert, ActionSheet, FabContainer } from 'ionic-angular';
import { ObjectifsService } from '../../services/objectifs.service';
import { AddObjectifPage } from '../addObjectif/addObjectif';
import { DateService } from '../../services/date.service';
import { DatePicker } from '@ionic-native/date-picker';
import { AppConstants } from '../../app/app.constants';
import { Objectif } from '../../models/objectif.model';
import { StatsService } from '../../services/stats.service';
import { Stats } from '../../models/stats.model';
import { Day } from '../../models/day.model';
import { ObjectifsLaterService } from '../../services/objectifsLater.service';
import { UtilsService } from '../../services/utils.service';
import _ from 'lodash';

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
    nbrLater: string;

    constructor(public navCtrl: NavController, private objectifsService: ObjectifsService,
        public modalCtrl: ModalController, private dateService: DateService,
        public actionSheetCtrl: ActionSheetController, private datePicker: DatePicker,
        private statsService: StatsService, private alertCtrl: AlertController,
        private objectifsLaterService: ObjectifsLaterService, private utilsService: UtilsService) {
        this.categoriesJson = this.utilsService.getObjectFromArray('id', ['title', 'icon', 'color'], AppConstants.categories);
        this.importancesJson = this.utilsService.getObjectFromArray('id', ['icon', 'color', 'index'], AppConstants.importances);

        this.limitDescription = AppConstants.limitDescription;
        this.nbrDaysDisplayed = AppConstants.nbrDaysDisplayed;

        this.objectifs = this.objectifsService.getAll();
        this.initDays(null, null);
        //Useful for checkWeekStats() 
        this.week1 = new Date(new Date().getFullYear(), 0, 4);

        this.nbrLater = this.objectifsLaterService.getNbr();
    }

    initDays(addBegin: boolean, currentIndex: number, date?: Date): void {
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

        //If we add days at the begining, the index of the current slide changed
        if (addBegin !== null && addBegin === true) {
            setTimeout(() => {
                this.slides.slideTo(currentIndex.valueOf() + this.nbrDaysDisplayed, 0, false);
            });
        }
    }

    private constructDay(addBegin: boolean, date: Date) {
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
                obj.date = this.dateService.getStringFromDate(date);

                this.objectifsService.saveChanges();
                this.initDays(null, null);
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
            this.bluredContent = false;
        });

        this.bluredContent = true;

        actionSheet.present();
    }

    openFabList(): void {
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
                this.initDays(null, null);
                this.checkWeekStats(true);
                this.nbrLater = this.objectifsLaterService.getNbr();
            }
        })
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

    checkWeekStats(reset?: boolean): void {
        //Get week from the current day
        let date: Date = this.dateService.getDateFromString(this.days[this.slides.getActiveIndex()].date);
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
