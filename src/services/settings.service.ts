import { Injectable } from '@angular/core';
import { Settings } from '@modelsPRN/settings.model';
import { AppConstants } from '@appPRN/app.constants';
import { Storage } from '@ionic/storage';
import _ from 'lodash';

@Injectable()
export class SettingsService {
    settings: Settings;

    constructor(private storage: Storage) { }

    public loadStored(): Promise<void> {
        console.log('load stored settings begin');
        return new Promise((resolve, reject) => {
            this.storage.get(AppConstants.storageNames.settings).then((settings: Settings) => {
                if (!settings) {
                    this.settings = _.cloneDeep(AppConstants.settingsDefault);
                    this.storage.set(AppConstants.storageNames.settings, this.settings);
                } else {
                    this.settings = settings;
                }
                console.log('load stored settings ended');

                resolve();
            });
        });
    }

    public isPasswordActivated(): boolean {
        return this.settings.password;
    }

    public checkPassword(password: string): boolean {
        return this.settings.passwordValue === password;
    }

    public set(settings: Settings): void {
        this.settings = settings;
        this.storage.set(AppConstants.storageNames.settings, settings);
    }

    public get(key: string): any {
        return this.settings[key];
    }
}