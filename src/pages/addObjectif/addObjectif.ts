import { Component, ViewChild } from '@angular/core';
import { ViewController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { ObjectifsService } from '../../services/objectifs.service';
import { AppConstants } from '../../app/app.constants';
import { FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash';
import { DateService } from '../../services/date.service';
import { Objectif } from '../../models/objectif.model';
import { SuggestionsService } from '../../services/suggestions.service';
import { ObjectifsLaterService } from '../../services/objectifsLater.service';
import { AutoCompleteComponent } from '../../components/ionic2-auto-complete';

@Component({
    selector: 'page-add-objectif',
    templateUrl: 'addObjectif.html'
})
export class AddObjectifPage {
    @ViewChild('autocomplete') autocomplete: AutoCompleteComponent;

    categories: any[];
    formGroup: any;
    submitAttempted: boolean = false;
    idLater: number = null;
    isLaterEmpty: boolean = true;
    importances: any[];
    bluredContent: boolean = false;

    constructor(public viewCtrl: ViewController, public formBuilder: FormBuilder,
        private objectifsService: ObjectifsService, private dateService: DateService,
        public suggestionsService: SuggestionsService, private navParams: NavParams,
        private alertCtrl: AlertController, private toastCtrl: ToastController,
        private objectifsLaterService: ObjectifsLaterService) {
        // Initial category value: relational
        this.formGroup = formBuilder.group({
            title: ['', [Validators.required]],
            date: [this.navParams.get('date'), [Validators.required]],
            category: [this.suggestionsService.getCategoryMostUsed(), [Validators.required]],
            description: ['', []],
            reportable: [true, [Validators.required]],
            importance: [AppConstants.initialImportance, [Validators.required]]
        });

        this.importances = AppConstants.importances;
        this.categories = AppConstants.categories;
        this.isLaterEmpty = this.objectifsLaterService.isListEmpty();
    }

    ionViewDidEnter(): void {
        // Set focus on the auto-focus at the init of the page
        this.autocomplete.setFocus();
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

        objectif.date = this.dateService.formatDateString(objectif.date);
        objectif.done = false;
        objectif.reportCount = 0;

        this.objectifsService.add(objectif);

        if (this.idLater) {
            this.objectifsLaterService.remove(this.idLater);
        }

        this.viewCtrl.dismiss(objectif);
    }

    showAddedForLater(): void {
        this.bluredContent = true;

        const alert = this.alertCtrl.create({
            title: 'Choisissez un objectif',
            buttons: [
                {
                    text: 'Annuler',
                    handler: () => {
                        this.idLater = null;
                    }
                },
                {
                    text: 'Valider',
                    handler: (data: any) => {
                        if (!data) {
                            const toast = this.toastCtrl.create({
                                message: 'Vous devez sélectionner un objectif',
                                duration: 3000
                            });
                            toast.present();

                            return false;
                        }

                        this.formGroup.patchValue({ title: data.title });
                        this.formGroup.patchValue({ description: data.description });

                        this.idLater = data.id;
                    }
                }
            ]
        });

        this.objectifsLaterService.getAll().forEach((obj: any) => {
            let selected: boolean = false;

            if (this.idLater !== null && this.idLater === obj.id) {
                selected = true;
            }

            alert.addInput({
                type: 'radio',
                label: obj.title,
                value: obj,
                checked: selected
            });
        });

        alert.onWillDismiss(() => {
            this.bluredContent = false;
        });

        alert.present();
    }

    setBluredContent(status: boolean): void {
        this.bluredContent = status;
    }

    checkWarning() {
        this.submitAttempted = false;
    }
}
