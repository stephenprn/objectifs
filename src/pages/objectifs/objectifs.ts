import { Component, ViewChild } from '@angular/core';
import { NavController, ModalController, ActionSheetController, Slides, Modal } from 'ionic-angular';
import { ObjectifsService } from '../../services/objectifs.service';
import { AddObjectifPage } from '../addObjectif/addObjectif';
import { DateService } from '../../services/date.service';
import { DatePicker } from '@ionic-native/date-picker';
import { AppConstants } from '../../app/app.constants';
import { Objectif } from '../../models/objectif.model';
import { StatsService } from '../../services/stats.service';
import { Stats } from '../../models/stats.model';

@Component({
    selector: 'page-objectifs',
    templateUrl: 'objectifs.html'
})
export class ObjectifsPage {
    @ViewChild(Slides) slides: Slides;

    objectifs: Objectif[];
    days: any[];
    nbrDaysDisplayed: number;
    closeDays: any = null;
    stats: Stats;

    constructor(public navCtrl: NavController, private objectifsService: ObjectifsService,
        public modalCtrl: ModalController, private dateService: DateService,
        public actionSheetCtrl: ActionSheetController, private datePicker: DatePicker,
        private statsService: StatsService) {
        this.nbrDaysDisplayed = AppConstants.nbrDaysDisplayed;
        this.objectifs = this.objectifsService.getAll();
        this.initDays(null, null);
        this.stats = this.statsService.getStats();
    }

    initDays(addBegin: boolean, currentIndex: number): void {
        let date: Date = new Date();
        let nbrDays: number;

        if (this.closeDays === null) {
            this.closeDays = this.dateService.getCloseDays(date);
        }

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
            if (addBegin === null || addBegin === false) {
                date.setDate(date.getDate() + 1);
            } else {
                date.setDate(date.getDate() - 1);
            }

            let day: any = {
                date: null,
                objectifs: [],
                countDone: 0
            };

            day.date = this.dateService.getStringFromDate(date);
            day.objectifs = this.objectifs.filter((obj: Objectif) => {
                return obj.date === day.date;
            });
            day.countDone = this.statsService.getNumberDone(day.objectifs);

            //We replace the date by yesterday, today or tomorrow
            if (addBegin === null) {
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

            if (addBegin === null || addBegin === false) {
                this.days.push(day);
            } else {
                this.days.unshift(day);
            }
        }

        //If we add days at the begining, the index of the current slide changed
        if (addBegin !== null && addBegin === true) {
            setTimeout(() => {
                this.slides.slideTo(currentIndex.valueOf() + this.nbrDaysDisplayed, 0, false);
            });
        }

        console.log(this.days);
    }

    report(obj: Objectif): void {
        this.datePicker.show({
            date: this.dateService.getDateFromString(obj.date),
            mode: 'date',
            androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
        }).then(
            (date: Date) => {
                console.log('new date: ' + date);

                obj.reportCount++;
                obj.date = this.dateService.getStringFromDate(date);

                this.objectifsService.saveChanges();
                this.initDays(null, null);
                
                //Update stats
                if (obj.reportCount === 1) {
                    this.stats.reported++;
                }
                this.stats.reports++;
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
            this.days[this.slides.getActiveIndex()].countDone++;
            this.stats.done++;
        } else {
            this.days[this.slides.getActiveIndex()].countDone--;
            this.stats.done--;
        }

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

        const actionSheet = this.actionSheetCtrl.create({
            title: obj.title,
            buttons: buttons
        });

        actionSheet.present();
    }

    showAdd(): void {
        //Get the date of the current slide and convert it to format YYYY-MM-DD
        const date = this.dateService.formatDateString(this.days[this.slides.getActiveIndex()].date, true);
        const modal: Modal = this.modalCtrl.create(AddObjectifPage, { date: date });

        // modal.onDidDismiss((objectif: any) => {
        //   if (objectif != null) {
        //     this.objectifs.push(objectif);
        //   }
        // });

        modal.present();

        modal.onDidDismiss((obj: Objectif) => {
            if (obj != null) {
                this.stats.total++;
                this.initDays(null, null);
            }
        })
    }

    slideDidChange(): void {
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
}
