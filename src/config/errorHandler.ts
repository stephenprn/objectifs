import { Injectable, isDevMode } from "@angular/core";
import { Platform } from 'ionic-angular';
import { UiService } from "@servicesPRN/ui.service";

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