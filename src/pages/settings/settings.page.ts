import { Component } from "@angular/core";
import { ViewController, Alert, AlertController } from "ionic-angular";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { UiService } from "@servicesPRN/ui.service";
import { NotificationsService } from "@servicesPRN/notifications.service";

@Component({
    selector: 'page-settings',
    templateUrl: 'settings.page.html'
})
export class SettingsPage {
    formGroup: FormGroup;
    password: string = '';

    constructor(private viewCtrl: ViewController, formBuilder: FormBuilder,
        private alertCtrl: AlertController, private uiService: UiService,
        private notificationsService: NotificationsService) {
        // Initial category value: relational
        this.formGroup = formBuilder.group({
            notifications: [true, [Validators.required]],
            notificationsHours: ['18:00', [Validators.required]],
            password: [false, [Validators.required]]
        });
    }

    submit(): void {
        console.log(this.formGroup);
    }

    openPassword(): void {
        let alert: Alert = this.alertCtrl.create({
            title: 'Mot de passe',
            inputs: [
                {
                    name: 'password',
                    placeholder: 'mot de passe',
                    type: 'password'
                },
                {
                    name: 'passwordConfirmation',
                    placeholder: 'confirmation',
                    type: 'password'
                }
            ],
            buttons: [
                {
                    text: 'Annuler',
                    role: 'cancel',
                    handler: () => {
                        if (this.password == null || this.password.length === 0) {
                            this.formGroup.patchValue({ password: false })
                        }
                    }
                },
                {
                    text: 'Ok',
                    handler: (data: any) => {
                        if (data.password == null || data.password.length === 0) {
                            this.uiService.displayToast('Vous devez entrer un mot de passe')
                            return false;
                        } if (data.password === data.passwordConfirmation) {
                            this.password = data.password;
                            this.uiService.displayToast('Mot de passe configuré !')
                        } else {
                            this.uiService.displayToast('Les mots de passe doivent être identiques')
                            return false;
                        }
                    }
                }
            ]
        });

        alert.present();
        console.log('tes');
    }

    notificationsCheckPermission(): void {
        this.notificationsService.checkPermission();
    }

    dismissModal(): void {
        this.viewCtrl.dismiss(null);
    }
}