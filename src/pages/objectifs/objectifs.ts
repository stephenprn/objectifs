import { Component } from '@angular/core';
import { NavController, ModalController, ActionSheetController } from 'ionic-angular';
import { ObjectifsService } from '../../services/objectifs.service';
import { AddObjectifPage } from '../addObjectif/addObjectif';
import { DateService } from '../../services/date.service';
import { DatePicker } from '@ionic-native/date-picker';

@Component({
  selector: 'page-objectifs',
  templateUrl: 'objectifs.html',
  providers: [DateService]
})
export class ObjectifsPage {
  objectifs: any[];
  days: any[];

  constructor(public navCtrl: NavController, private objectifsService: ObjectifsService, public modalCtrl: ModalController, 
    private dateService: DateService, public actionSheetCtrl: ActionSheetController, private datePicker: DatePicker) {
    this.objectifs = this.objectifsService.getAll();
    console.log(this.objectifs);
    this.initDays();
  }

  initDays(): void {
    this.days = [];
    let date = new Date();
    date.setDate(date.getDate() - 2);

    for (let i = -2; i < 3; i++) {
      date.setDate(date.getDate() + 1);

      let day = {
        date: null,
        objectifs: []
      };

      day.date = this.dateService.getStringFromDate(date);
      day.objectifs = this.objectifs.filter((objectif: any) => {
        return objectif.date === day.date;
      });

      this.days.push(day);
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
        this.initDays();
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
 
  showActions(obj: any): void  {
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
        this.initDays();
      }
    })
  }
}
