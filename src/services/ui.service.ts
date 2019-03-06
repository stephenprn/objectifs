import { Injectable } from '@angular/core';
import { AppConstants } from '@appPRN/app.constants';
import { Alert, AlertController, ToastController, ToastOptions } from 'ionic-angular';
import _ from 'lodash';

@Injectable()
export class UiService {
    constructor(private toastCtrl: ToastController, private alertCtrl: AlertController) { }

    public displayToast(text: string): void {
        let options: ToastOptions = _.cloneDeep(AppConstants.toastDefaultConfig);
        options.message = text;

        this.toastCtrl.create(options).present();
    }

    public displaySimpleAlert(title: string, subTitle: string, message?: string) {
        const alert: Alert = this.alertCtrl.create({
            title: title,
            subTitle: subTitle,
            message: message,
            buttons: ['OK']
        });

        alert.present();
    }
}