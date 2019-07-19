import { Component } from "@angular/core";
import { ViewController, Alert, AlertController } from "ionic-angular";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { UiService } from "@servicesPRN/ui.service";
import { NotificationsService } from "@servicesPRN/notifications.service";
import { Settings } from "@modelsPRN/settings.model";
import { SettingsService } from "@servicesPRN/settings.service";

@Component({
    selector: 'page-settings',
    templateUrl: 'settings.page.html'
})
export class SettingsPage {
    formGroup: FormGroup;
    password: string = '';
    notificationsWorking: boolean = false;

    constructor(private viewCtrl: ViewController, formBuilder: FormBuilder,
        private alertCtrl: AlertController, private uiService: UiService,
        private notificationsService: NotificationsService, private settingsService: SettingsService) {
        // Initial category value: relational
        this.formGroup = formBuilder.group({
            notifications: [this.settingsService.get('notifications'), [Validators.required]],
            notificationsHours: [this.settingsService.get('notificationsHours'), [Validators.required]],
            password: [this.settingsService.get('password'), [Validators.required]]
        });

        this.password = this.settingsService.get('passwordValue');
    }

    submit(): void {
        let settings: Settings = this.formGroup.value;
        settings.passwordValue = this.password;

        this.settingsService.set(settings);
    }

    openPassword(): void {
        let inputs = [
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
        ];

        if (this.password != null && this.password  !== '') {
            inputs.unshift({
                name: 'oldPassword',
                placeholder: 'ancien mot de passe',
                type: 'password'
            });
        }

        let alert: Alert = this.alertCtrl.create({
            title: 'Mot de passe',
            inputs: inputs,
            enableBackdropDismiss: true,
            buttons: [
                {
                    text: 'Annuler',
                    role: 'cancel',
                    handler: () => {
                        if (this.password == null || this.password.length === 0) {
                            this.formGroup.patchValue({ password: false });
                            this.submit();
                        }
                    }
                },
                {
                    text: 'Ok',
                    handler: (data: any) => {
                        if (data.password == null || data.password.length === 0) {
                            this.uiService.displayToast('Vous devez entrer un mot de passe');
                            return false;
                        } else if ('oldPassword' in data && data.oldPassword != this.password) {
                            this.uiService.displayToast('Ancien mot de passe erroné')
                            return false;
                        } else if (data.password === data.passwordConfirmation) {
                            this.password = data.password;
                            this.submit();
                            this.uiService.displayToast('Mot de passe configuré !');
                        } else {
                            this.uiService.displayToast('Les mots de passe doivent être identiques');
                            return false;
                        }
                    }
                }
            ]
        });

        alert.onDidDismiss(() => {
            this.submit();
        });

        alert.present();
    }

    passwordToggleChange(): void {
        // If toggle is active and no password is set, we display the dialog to set a password
        if (this.formGroup.get('password').value && (this.password == null || this.password === '')) {
            this.openPassword();
        } else {
            this.submit();
        }
    }

    notificationsToggleChange(): void {
        this.notificationsWorking = true;

        if (this.formGroup.get('notifications').value) {
            this.notificationsCheckPermission();
            this.notificationsService.enable().then(() => {
                this.submit();
                this.notificationsWorking = false;
            });
        } else {
            this.notificationsService.disable().then(() => {
                this.submit();
                this.notificationsWorking = false;
            });
        }
    }

    notificationHoursChange(): void {
        this.notificationsWorking = true;
        this.submit();
        this.notificationsService.updateHours().then(() => {
            this.notificationsWorking = false;
        });
    }

    notificationsCheckPermission(): void {
        this.notificationsService.checkPermission();
    }

    dismissModal(): void {
        this.viewCtrl.dismiss(null);
    }
}