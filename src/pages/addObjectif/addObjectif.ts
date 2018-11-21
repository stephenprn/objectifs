import { Component } from '@angular/core';
import { NavController, IonicPage, ViewController, AlertController } from 'ionic-angular';
import { ObjectifsService } from '../../services/objectifs.service';
import { AppConstants } from '../../app/app.constants';
import { FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash';
import { DateService } from '../../services/date.service';

@Component({
  selector: 'page-add-objectif',
  templateUrl: 'addObjectif.html',
  providers: [DateService]
})
export class AddObjectifPage {
  colors: any[] = [];
  formGroup: any;
  submitAttempted: boolean = false;

  constructor(public viewCtrl: ViewController, private alertCtrl: AlertController, public formBuilder: FormBuilder,
    private objectifsService: ObjectifsService, private dateService: DateService) {
    //Initial color value: blue
    this.formGroup = formBuilder.group({
      title: ['', [Validators.required]],
      date: ['', [Validators.required]],
      color: ['#2196F3', [Validators.required]],
      description: ['', [Validators.required]]
    });

    this.colors = AppConstants.colors;
  }

  dismiss() {
    this.viewCtrl.dismiss(null);
  }

  submit() {
    if (!this.formGroup.valid) {
      this.submitAttempted = true;
      console.log('not valid');
      return;
    }

    let objectif = _.cloneDeep(this.formGroup.value);

    objectif.date = this.dateService.reformatDate(objectif.date);

    this.objectifsService.add(objectif);
    this.viewCtrl.dismiss(objectif);
  }
}
