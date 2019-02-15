import { DOCUMENT } from '@angular/common';
import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppConstants } from '@appPRN/app.constants';
import { AutoCompleteComponent } from '@componentsPRN/ionic2-auto-complete';
import { Objectif } from '@modelsPRN/objectif.model';
import { DateService } from '@servicesPRN/date.service';
import { ObjectifsService } from '@servicesPRN/objectifs.service';
import { ObjectifsLaterService } from '@servicesPRN/objectifsLater.service';
import { SuggestionsService } from '@servicesPRN/suggestions.service';
import { UiService } from '@servicesPRN/ui.service';
import { UtilsService } from '@servicesPRN/utils.service';
import { Alert, AlertController, NavParams, Select, ViewController } from 'ionic-angular';
import { AlertInputOptions } from 'ionic-angular/umd/components/alert/alert-options';
import _ from 'lodash';

@Component({
    selector: 'page-add-objectif',
    templateUrl: 'addObjectif.html'
})
export class AddObjectifPage {
    @ViewChild('autocomplete') autocomplete: AutoCompleteComponent;
    @ViewChild(Select) select: Select;

    categories: {id: string, title: string, icon: string, color: string }[];
    formGroup: FormGroup;
    errorsAfterSubmit: any = { title: false };
    idLater: number = null;
    isLaterEmpty: boolean = true;
    importances: {id: string, title: string, icon: string, color: string, index: number}[];
    periodicities: {id: string, title: string}[];
    bluredContent: boolean = false;
    periodicityCustom: {number: number, type: string, text: string};
    periodicitiesCustomJson: any = {};
    document: Document;

    constructor(public viewCtrl: ViewController, public formBuilder: FormBuilder,
        private objectifsService: ObjectifsService, private dateService: DateService,
        public suggestionsService: SuggestionsService, private navParams: NavParams,
        private alertCtrl: AlertController, private uiService: UiService,
        private objectifsLaterService: ObjectifsLaterService, @Inject(DOCUMENT) document,
        private utilsService: UtilsService) {
        const date: string = this.navParams.get('date');

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
    }

    dismiss(): void {
        this.viewCtrl.dismiss(null);
    }

    openPeriodicity(): void {
        const alert: Alert = this.alertCtrl.create({
            title: 'Intervalle personnalisé',
            subTitle: 'Répéter cet objectif tou(te)s les :',
            inputs: [
            ],
            buttons: [
                {
                    text: 'Annuler',
                    role: 'cancel'
                },
                {
                    text: 'Ok',
                    handler: (type: string) => {
                        const periodicityNbr: string = (<HTMLInputElement>this.document.getElementById('periodicityNbr')).value;
                        const nbr: number = Number(periodicityNbr);

                        if (!type || !periodicityNbr) {
                            this.uiService.displayToast('Vous devez entrer un nombre');
                            return false;
                        }

                        if (isNaN(nbr) || nbr < 1) {
                            this.uiService.displayToast('Vous devez entrer un nombre valide');
                            return false;
                        } else if (nbr > AppConstants.limitNbrPeriodicity) {
                            this.uiService.displayToast('Le nombre entré est trop élevé');
                            return false;
                        } 

                        this.periodicityCustom.number = nbr;
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
        let alertHeader: Element;

        setTimeout(() => {
            alertHeader = this.document.getElementsByClassName('alert-head')[0];

            let inputNumber: HTMLInputElement = this.document.createElement('input');

            inputNumber.setAttribute('type', 'number');
            inputNumber.setAttribute('id', 'periodicityNbr');
            inputNumber.setAttribute('placeholder', 'nbr');
            inputNumber.setAttribute('min', '2');
            inputNumber.setAttribute('max', String(AppConstants.limitNbrPeriodicity));
            inputNumber.value = String(this.periodicityCustom.number);

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
                            this.uiService.displayToast('Vous devez sélectionner un objectif');
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

    checkWarning(field: string): void {
        this.errorsAfterSubmit[field] = false;
    }
}
