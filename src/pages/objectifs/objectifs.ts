import { Component, ViewChild } from '@angular/core';
import { NavController, ModalController, ActionSheetController, Slides } from 'ionic-angular';
import { ObjectifsService } from '../../services/objectifs.service';
import { AddObjectifPage } from '../addObjectif/addObjectif';
import { DateService } from '../../services/date.service';
import { DatePicker } from '@ionic-native/date-picker';
import { AppConstants } from '../../app/app.constants';

@Component({
  selector: 'page-objectifs',
  templateUrl: 'objectifs.html',
  providers: [DateService]
})
export class ObjectifsPage {
  @ViewChild(Slides) slides: Slides;
  objectifs: any[];
  days: any[];
  nbrDaysDisplayed: number;

  constructor(public navCtrl: NavController, private objectifsService: ObjectifsService, public modalCtrl: ModalController,
    private dateService: DateService, public actionSheetCtrl: ActionSheetController, private datePicker: DatePicker) {
    this.nbrDaysDisplayed = AppConstants.nbrDaysDisplayed;
    this.objectifs = this.objectifsService.getAll();
    console.log(this.objectifs);
    this.initDays(null, null);
  }

  initDays(addBegin: Boolean, currentIndex: Number): void {
    let date;
    let iEnd;

    if (addBegin === null) {
      this.days = [];

      date = new Date();
      date.setDate(date.getDate() - this.nbrDaysDisplayed);

      iEnd = 2 * this.nbrDaysDisplayed;
    } else {
      if (addBegin) {
        date = this.dateService.getDateFromString(this.days[0].date);
      } else {
        date = this.dateService.getDateFromString(this.days[this.days.length - 1].date);
      }

      iEnd = this.nbrDaysDisplayed;
    }

    for (let i = 0; i < iEnd; i++) {
      if (addBegin === null || addBegin === false) { 
        date.setDate(date.getDate() + 1); 
      } else {
        date.setDate(date.getDate() - 1);
      }

      let day = {
        date: null,
        objectifs: []
      };

      day.date = this.dateService.getStringFromDate(date);
      day.objectifs = this.objectifs.filter((objectif: any) => {
        return objectif.date === day.date;
      });

      if (addBegin === null || addBegin === false) {
        this.days.push(day);
      } else {
        this.days.unshift(day);
      }
    }

    if (addBegin !== null && addBegin === true) {
      setTimeout(() => {
        this.slides.slideTo(currentIndex.valueOf() + this.nbrDaysDisplayed, 0, false);
      });
    }

    console.log(this.days);
  }

  report(obj: any): void {
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
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  setDone(obj: any, done: boolean): void {
    obj.done = done;
    this.objectifsService.saveChanges();
  }

  showActions(obj: any): void {
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

    let actionSheet = this.actionSheetCtrl.create({
      title: obj.title,
      buttons: buttons
    });

    actionSheet.present();
  }

  showAdd(): void {
    let modal = this.modalCtrl.create(AddObjectifPage);

    // modal.onDidDismiss((objectif: any) => {
    //   if (objectif != null) {
    //     this.objectifs.push(objectif);
    //   }
    // });

    modal.present();

    modal.onDidDismiss((obj: any) => {
      if (obj != null) {
        this.initDays(null, null);
      }
    })
  }

  slideWillChange(): void {
    let currentIndex = this.slides.getActiveIndex();

    if (currentIndex == null) {
      return;
    }

    if (currentIndex < AppConstants.indexTriggerCache) {
      this.initDays(true, currentIndex);
    } else if (currentIndex >= this.days.length - AppConstants.indexTriggerCache) {
      this.initDays(false, null);
    }

    console.log(currentIndex);
  }
}
