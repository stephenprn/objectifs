import { Injectable, isDevMode } from '@angular/core';
import { UiService } from '@servicesPRN/ui.service';
import { Platform } from 'ionic-angular';

@Injectable()
export class ErrorHandler implements ErrorHandler {
    constructor(private platform: Platform, private uiService: UiService) {
    }

    handleError(error: Error) {
        if (isDevMode()) {
            console.error(error);

            if (this.platform.is('cordova')) {
                this.uiService.displaySimpleAlert('Erreur', error.name, error.message);
            }
        }
        
        throw error;
    }
}