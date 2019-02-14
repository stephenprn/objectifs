import { Component, ViewChild, Inject } from '@angular/core';
import { ViewController, NavParams, AlertController, ToastController, Select } from 'ionic-angular';
import { ObjectifsService } from '../../services/objectifs.service';
import { AppConstants } from '../../app/app.constants';
import { FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash';
import { DateService } from '../../services/date.service';
import { Objectif } from '../../models/objectif.model';
import { SuggestionsService } from '../../services/suggestions.service';
import { ObjectifsLaterService } from '../../services/objectifsLater.service';
import { AutoCompleteComponent } from '../../components/ionic2-auto-complete';
import { DOCUMENT } from '@angular/common';
import { UtilsService } from '../../services/utils.service';
import { AlertInputOptions } from 'ionic-angular/umd/components/alert/alert-options';

@Component({
    selector: 'page-add-objectif',
    templateUrl: 'addObjectif.html'
})
export class AddObjectifPage {
    @ViewChild('autocomplete') autocomplete: AutoCompleteComponent;
    @ViewChild(Select) select: Select;

    categories: any[];
    formGroup: any;
    errorsAfterSubmit: any = { title: false };
    idLater: number = null;
    isLaterEmpty: boolean = true;
    importances: any[];
    periodicities: any[];
    bluredContent: boolean = false;
    periodicityCustom: any = {};
    periodicitiesCustomJson: any = {};
    document: any;

    constructor(public viewCtrl: ViewController, public formBuilder: FormBuilder,
        private objectifsService: ObjectifsService, private dateService: DateService,
        public suggestionsService: SuggestionsService, private navParams: NavParams,
        private alertCtrl: AlertController, private toastCtrl: ToastController,
        private objectifsLaterService: ObjectifsLaterService, @Inject(DOCUMENT) document,
        private utilsService: UtilsService) {
        const date = this.navParams.get('date');

        // Initial category value: relational
        this.formGroup = formBuilder.group({
            title: ['', [Validators.required]],
            date: [date, [Validators.required]],
            category: [this.suggestionsService.getCategoryMostUsed(), [Validators.required]],
            customCategory: ['', []],
            description: ['', []],
            reportable: [true, [Validators.required]],
            importance: [AppConstants.initialImportance, [Validators.required]],
            periodicity: [AppConstants.initialPeriodicity, [Validators.required]],
            dateEndPeriodicity: [this.dateService.initDatePeriodic(date), [Validators.required]]
        });

        this.importances = AppConstants.importances;
        this.categories = AppConstants.categories;
        this.periodicities = AppConstants.periodicities;
        this.isLaterEmpty = this.objectifsLaterService.isListEmpty();
        this.document = document;
        this.periodicitiesCustomJson = this.utilsService.getObjectFromArray('id', ['title', 'every'], AppConstants.customPeriodicities);
        this.periodicityCustom = _.cloneDeep(AppConstants.initialCustomPeriodicity);
        this.getTitlePeriodicityCustom();
    }

    ionViewDidEnter(): void {
        // Set focus on the auto-focus at the init of the page
        this.autocomplete.setFocus();

        console.log(this.select);
    }

    dismiss(): void {
        this.viewCtrl.dismiss(null);
    }

    openPeriodicity(): void {
        const alert = this.alertCtrl.create({
            title: 'Intervalle personnalisé',
            subTitle: 'Répéter cet objectif tou(te)s les :',
            inputs: [
            ],
            buttons: [
                {
                    text: 'Annuler',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Ok',
                    handler: (data: any) => {
                        const periodicityNbr = this.document.getElementById('periodicityNbr').value;
                        const type = data;

                        if (!type || !periodicityNbr) {
                            this.toastCtrl.create({
                                message: 'Vous devez remplir tous les champs',
                                duration: 3000
                            }).present();

                            return false;
                        }

                        if (isNaN(Number(periodicityNbr)) || Number(periodicityNbr) < 1) {
                            this.toastCtrl.create({
                                message: 'Vous devez entrer un nombre valide',
                                duration: 3000
                            }).present();

                            return false;
                        }

                        this.periodicityCustom.number = Number(periodicityNbr);
                        this.periodicityCustom.type = type;
                        this.getTitlePeriodicityCustom();
                    }
                }
            ]
        });

        AppConstants.customPeriodicities.forEach((periodicity: any) => {
            let input: AlertInputOptions = {
                type: 'radio',
                label: periodicity.title,
                value: periodicity.id
            };

            if (periodicity.id === this.periodicityCustom.type) {
                input.checked = true;
            }

            alert.addInput(input);
        });

        alert.present();
        this.addInputNumberToAlert();
    }

    private addInputNumberToAlert(): void {
        let alertHeader;

        setTimeout(() => {
            alertHeader = this.document.getElementsByClassName('alert-head')[0];

            let inputNumber = this.document.createElement('input');

            inputNumber.setAttribute('type', 'number');
            inputNumber.setAttribute('id', 'periodicityNbr');
            inputNumber.setAttribute('placeholder', 'nbr');
            inputNumber.setAttribute('min', '2');
            inputNumber.setAttribute('max', '100');
            inputNumber.value = this.periodicityCustom.number;

            alertHeader.append(inputNumber);
        });
    }

    private getTitlePeriodicityCustom(): void {
        this.periodicityCustom.text = this.periodicitiesCustomJson[this.periodicityCustom.type].every + this.periodicityCustom.number + ' ' +
            this.periodicitiesCustomJson[this.periodicityCustom.type].title;
    }

    submit(): void {
        this.formGroup.patchValue({
            title: this.autocomplete.keyword
        });

        console.log(this.formGroup);

        if (!this.formGroup.valid) {
            if (!this.formGroup.get('title').valid) {
                this.errorsAfterSubmit.title = true;
            }

            return;
        }

        let objectif: Objectif = _.cloneDeep(this.formGroup.value);

        objectif.date = this.dateService.formatDateString(objectif.date);
        objectif.done = false;
        objectif.reportCount = 0;

        if (this.formGroup.get('periodicity').value !== 'punctual') {
            objectif.dateEndPeriodicity = this.dateService.formatDateString(objectif.dateEndPeriodicity);
        }

        if (this.formGroup.get('periodicity').value === 'custom') {
            objectif.periodicity = this.periodicityCustom.type;
            objectif.periodicityCustomNumber = this.periodicityCustom.number;
        }

        if (objectif.category === 'other') {
            objectif.customCategory = this.formGroup.controls['customCategory'].value;
        }

        console.log(objectif);

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

    checkWarning(field: string) {
        this.errorsAfterSubmit[field] = false;
    }
}
