import { Component, ViewChild } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { ObjectifsService } from '../../services/objectifs.service';
import { AppConstants } from '../../app/app.constants';
import { FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash';
import { DateService } from '../../services/date.service';
import { Objectif } from '../../models/objectif.model';
import { SuggestionsService } from '../../services/suggestions.service';
import { AutoCompleteComponent } from 'ionic2-auto-complete';

@Component({
  selector: 'page-add-objectif',
  templateUrl: 'addObjectif.html'
})
export class AddObjectifPage {
  @ViewChild('autocomplete') autocomplete: AutoCompleteComponent;
  
  colors: any[] = [];
  formGroup: any;
  submitAttempted: boolean = false;

  constructor(public viewCtrl: ViewController, public formBuilder: FormBuilder,
    private objectifsService: ObjectifsService, private dateService: DateService, public suggestionsService: SuggestionsService) {
    // Initial color value: blue
    this.formGroup = formBuilder.group({
      title: ['', [Validators.required]],
      date: ['', [Validators.required]],
      color: [AppConstants.initialColor, [Validators.required]],
      description: ['', [Validators.required]],
      reportable: [true, [Validators.required]]
    });

    this.colors = AppConstants.colors;

    // // Set focus on the auto-focus at the init of the page
    // this.autocomplete.setFocus();
  }

  dismiss(): void {
    this.viewCtrl.dismiss(null);
  }

  submit(): void {
    this.formGroup.patchValue({
      title: this.autocomplete.keyword
    });

    if (!this.formGroup.valid) {
      this.submitAttempted = true;
      return;
    }

    let objectif: Objectif = _.cloneDeep(this.formGroup.value);

    objectif.date = this.dateService.reformatDate(objectif.date);
    objectif.done = false;

    if (objectif.reportable) {
      objectif.reportCount = 0;
    }

    this.objectifsService.add(objectif);
    this.viewCtrl.dismiss(objectif);
  }
}
