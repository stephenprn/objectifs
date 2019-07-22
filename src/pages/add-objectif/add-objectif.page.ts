import { DOCUMENT } from '@angular/common';
import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppConstants } from '@appPRN/app.constants';
import { AutoCompleteComponent } from '@componentsPRN/ionic2-auto-complete';
import { Category } from '@modelsPRN/category.model';
import { CustomDayPeriodicity } from '@modelsPRN/custom-day-periodicity.model';
import { CustomPeriodicity } from '@modelsPRN/custom-periodicity.model';
import { Importance } from '@modelsPRN/importance.model';
import { Objectif } from '@modelsPRN/objectif.model';
import { Periodicity } from '@modelsPRN/periodicity.model';
import { AchievementsService } from '@servicesPRN/achievements.service';
import { DateService } from '@servicesPRN/date.service';
import { NotificationsService } from '@servicesPRN/notifications.service';
import { ObjectifsLaterService } from '@servicesPRN/objectifs-later.service';
import { ObjectifsService } from '@servicesPRN/objectifs.service';
import { SuggestionsService } from '@servicesPRN/suggestions.service';
import { UiService } from '@servicesPRN/ui.service';
import { UtilsService } from '@servicesPRN/utils.service';
import { Alert, AlertController, NavParams, Select, ViewController } from 'ionic-angular';
import { AlertInputOptions } from 'ionic-angular/umd/components/alert/alert-options';
import _ from 'lodash';

@Component({
    selector: 'page-add-objectif',
    templateUrl: 'add-objectif.page.html'
})
export class AddObjectifPage {
    @ViewChild('autocomplete') autocomplete: AutoCompleteComponent;
    @ViewChild(Select) select: Select;

    categories: Category[];
    formGroup: FormGroup;
    errorsAfterSubmit: { title: boolean } = { title: false };
    idLater: number = null;
    isLaterEmpty: boolean = true;
    importances: Importance[];
    periodicities: Periodicity[];
    periodicityCustom: CustomPeriodicity;
    periodicitiesCustomJson: any = {};
    periodicitiesCustomDays: CustomDayPeriodicity[];
    document: Document;
    isFocus: boolean = false;
    updateId: number;
    minYear: number;
    maxDate: string;
    objectifUpdated: Objectif;

    constructor(public viewCtrl: ViewController, public formBuilder: FormBuilder,
        private objectifsService: ObjectifsService, private dateService: DateService,
        public suggestionsService: SuggestionsService, private navParams: NavParams,
        private alertCtrl: AlertController, private uiService: UiService,
        private objectifsLaterService: ObjectifsLaterService, @Inject(DOCUMENT) document,
        private utilsService: UtilsService, private notificationsService: NotificationsService,
        private achievementsService: AchievementsService) {
        let date: string;
        this.importances = _.cloneDeep(AppConstants.importances);

        if (this.navParams.get('objectif') == null) {
            date = this.navParams.get('date');

            // Initial category value: relational
            this.formGroup = formBuilder.group({
                title: ['', [Validators.required]],
                date: [date, [Validators.required]],
                category: [this.suggestionsService.getCategoryMostUsed(), [Validators.required]],
                customCategory: ['', []],
                description: ['', []],
                reportable: [true, [Validators.required]],
                periodicity: [AppConstants.initialPeriodicity, [Validators.required]],
                dateEndPeriodicity: [this.dateService.initDatePeriodic(date), [Validators.required]]
            });
        } else {
            const objectif: Objectif = this.navParams.get('objectif');
            this.patchForm(objectif);
        }

        this.categories = AppConstants.categories;
        this.periodicities = AppConstants.periodicities;
        this.isLaterEmpty = this.objectifsLaterService.isListEmpty();
        this.document = document;
        this.periodicitiesCustomJson = this.utilsService.getObjectFromArray('id', ['title', 'every'], AppConstants.customPeriodicities);
        this.periodicityCustom = _.cloneDeep(AppConstants.initialCustomPeriodicity);
        this.periodicitiesCustomDays = _.cloneDeep(AppConstants.customDaysPeriodicities);
        this.getTitlePeriodicityCustom();
        this.initMinMaxDates();
    }

    ngAfterViewChecked() {
        if (!this.isFocus) {
            setTimeout(() => {
                this.autocomplete.setFocus();
                this.isFocus = true;
            }, 200);
        }
    }

    private patchForm(objectif: Objectif, laterMode?: boolean) {
        const date = this.dateService.formatDateString(objectif.date, true);

        let dateEndPeriodicity;

        if (laterMode && objectif.dateEndPeriodicity != null) {
            dateEndPeriodicity = this.dateService.formatDateString(objectif.dateEndPeriodicity, true);
        }

        this.formGroup = this.formBuilder.group({
            title: [objectif.title, [Validators.required]],
            date: [date, [Validators.required]],
            category: [objectif.category, [Validators.required]],
            customCategory: [objectif.customCategory != null ? objectif.customCategory : '', []],
            description: [objectif.description, []],
            reportable: [objectif.reportable, [Validators.required]],
            periodicity: [laterMode ? objectif.periodicity : AppConstants.initialPeriodicity, [Validators.required]],
            dateEndPeriodicity: [(laterMode && objectif.dateEndPeriodicity) ? dateEndPeriodicity : this.dateService.initDatePeriodic(date), [Validators.required]]
        });

        if (!laterMode) {
            this.updateId = objectif.id;
        } else {
            this.idLater = objectif.id;

            if (objectif.periodicity === 'customDays') {
                for (const id of objectif.periodicityCustomDays) {
                    const day = this.periodicitiesCustomDays.find(d => d.id === id);

                    if (day != null) {
                        day.selected = true;
                    }
                }
            }
        }

        this.importances.forEach((imp: Importance) => {
            imp.id === objectif.importance ? imp.selected = true : imp.selected = false;
        });
    }

    displayConfirmationDismiss(): void {
        if (!this.formGroup.dirty) {
            this.dismissModal();
            return;
        }

        let alert: Alert = this.alertCtrl.create({
            title: "Abandonner l'objectif ?",
            subTitle: "Cet objectif sera supprimé définitivement.",
            enableBackdropDismiss: true,
            buttons: [
                {
                    text: "Annuler",
                    role: "destructive"
                },
                {
                    text: "Supprimer",
                    cssClass: 'redText',
                    handler: () => {
                        this.dismissModal();
                    }
                }
            ]
        });

        alert.present();
    }

    dismissModal(): void {
        this.viewCtrl.dismiss(null);
    }

    openPeriodicity(): void {
        const alert: Alert = this.alertCtrl.create({
            title: 'Intervalle personnalisé',
            subTitle: 'Répéter cet objectif tou(te)s les :',
            enableBackdropDismiss: true,
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

    // Hack to add input number to radio type alert
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

            alertHeader.appendChild(inputNumber);
        });
    }

    private getTitlePeriodicityCustom(): void {
        this.periodicityCustom.text = this.periodicitiesCustomJson[this.periodicityCustom.type].every + this.periodicityCustom.number + ' ' +
            this.periodicitiesCustomJson[this.periodicityCustom.type].title;
    }

    saveDraft(): void {
        if (this.formGroup.dirty) {
            const objectif = this.submit(true);
            this.objectifsLaterService.add(objectif).then((id: number) => {
                this.uiService.displayToastDraft(id);
            });
        }

        this.dismissModal();
    }

    submit(draft?: boolean): void | Objectif {
        this.formGroup.patchValue({
            title: this.autocomplete.keyword
        });

        if (!draft && !this.formGroup.valid) {
            if (!this.formGroup.get('title').valid) {
                this.errorsAfterSubmit.title = true;
            }

            return;
        }

        // Check if the begining date is before the ending date
        if ((this.formGroup.get('periodicity').value !== 'punctual')) {
            const beginDate: Date = this.dateService.getDateFromString(this.formGroup.value.date, true);
            const endDate: Date = this.dateService.getDateFromString(this.formGroup.value.dateEndPeriodicity, true);

            if (!draft && beginDate >= endDate) {
                this.uiService.displayToast('La date de début doit être antérieure à la date de fin');
                return;
            }
        }

        let selectedDays: CustomDayPeriodicity[];

        if (this.formGroup.get('periodicity').value === 'customDays') {
            selectedDays = this.periodicitiesCustomDays.filter((day: CustomDayPeriodicity) => {
                return day.selected;
            });

            if (!draft && selectedDays.length === 0) {
                this.uiService.displayToast('Vous devez sélectionner au moins un jour de la semaine');
                return;
            }
        }

        let objectif: Objectif = _.cloneDeep(this.formGroup.value);

        objectif.date = this.dateService.formatDateString(objectif.date);
        objectif.done = false;
        objectif.reportCount = 0;

        objectif.importance = this.importances.find((importance: Importance) => {
            return importance.selected;
        }).id;

        if (objectif.periodicity !== 'punctual') {
            objectif.dateEndPeriodicity = this.dateService.formatDateString(objectif.dateEndPeriodicity);
        } else {
            delete objectif.dateEndPeriodicity;
        }

        if (objectif.periodicity === 'custom') {
            objectif.periodicity = this.periodicityCustom.type;
            objectif.periodicityCustomNumber = this.periodicityCustom.number;
        }

        if (objectif.periodicity === 'customDays') {
            objectif.periodicityCustomDays = selectedDays.map((day: CustomDayPeriodicity) => {
                return day.id;
            }).sort();
        }

        if (objectif.category === 'other') {
            objectif.customCategory = this.formGroup.controls['customCategory'].value;
        }

        if (this.idLater) {
            this.objectifsLaterService.remove(this.idLater);
        }

        if (draft) {
            return objectif;
        }

        if (this.updateId != null) {
            objectif.id = this.updateId;
            this.objectifsService.update(objectif);
        } else {
            this.objectifsService.add(objectif);
        }

        this.achievementsService.checkAchievements();

        this.notificationsService.add(objectif);

        this.viewCtrl.dismiss(objectif);
    }

    showAddedForLater(): void {
        const alert = this.alertCtrl.create({
            title: 'Choisissez un objectif',
            enableBackdropDismiss: true,
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

                        this.patchForm(data, true);
                        // this.formGroup.patchValue({ title: data.title });
                        // this.formGroup.patchValue({ description: data.description });

                    }
                }
            ]
        });

        const objLater = _.cloneDeep(this.objectifsLaterService.getAll()).reverse();

        objLater.forEach((obj: any) => {
            let selected: boolean = false;

            if (this.idLater !== null && this.idLater === obj.id) {
                selected = true;
            }

            alert.addInput({
                type: 'radio',
                label: obj.title != null && obj.title != '' ? obj.title + ' - ' + obj.date : '(sans titre) - ' + obj.date,
                value: obj,
                checked: selected,
                handler: (radio: any) => {
                    const data = radio.value;

                    this.patchForm(data, true);

                    alert.dismiss();
                }
            });
        });

        alert.present();
    }

    checkWarning(field: string): void {
        this.errorsAfterSubmit[field] = false;
    }

    selectPeriodicityCustomDays(day: CustomDayPeriodicity): void {
        day.selected = !day.selected;
    }

    selectImportance(importance: Importance): void {
        if (importance.selected) {
            return;
        }

        this.importances.forEach((imp: Importance) => {
            if (imp.id === importance.id) {
                imp.selected = true;
            } else {
                imp.selected = false;
            }
        });
    }

    private initMinMaxDates(): void {
        const today: Date = new Date();

        this.minYear = today.getFullYear() - 2;

        today.setFullYear(today.getFullYear() + 20);
        this.maxDate = this.dateService.getStringFromDate(today, true);
    }
}
