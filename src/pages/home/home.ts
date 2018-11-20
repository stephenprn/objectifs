import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { ObjectifsService } from '../../services/objectifs.service';
import { AddObjectifPage } from '../addObjectif/addObjectif';
import { DateService } from '../../services/date.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [ DateService ]
})
export class HomePage {
  objectifs: any[];
  days: any[];

  constructor(public navCtrl: NavController, private objectifsService: ObjectifsService, public modalCtrl: ModalController, private dateService: DateService) {
    this.objectifs = this.objectifsService.getAll();
    console.log(this.objectifs);
    this.initDays();
  }

  initDays() {
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

  showAdd(): void {
    let modal = this.modalCtrl.create(AddObjectifPage);

    // modal.onDidDismiss((objectif: any) => {
    //   if (objectif != null) {
    //     this.objectifs.push(objectif);
    //   }
    // });

    modal.present();
  }
}
