import { Injectable } from '@angular/core';
import { AppConstants } from '@appPRN/app.constants';
import { ToastController, ToastOptions } from 'ionic-angular';
import _ from 'lodash';

@Injectable()
export class UiService {
    constructor(private toastCtrl: ToastController) { }

    public displayToast(text: string): void {
        let options: ToastOptions = _.cloneDeep(AppConstants.toastDefaultConfig);
        options.message = text;

        this.toastCtrl.create(options).present();
    }
}