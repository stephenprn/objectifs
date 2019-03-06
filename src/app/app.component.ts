import { Component, isDevMode } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { ObjectifsPage } from '@pagesPRN/objectifs/objectifs-page';
import { ObjectifsService } from '@servicesPRN/objectifs.service';
import { Platform } from 'ionic-angular';

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    rootPage: any = ObjectifsPage;

    constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, objectifsService: ObjectifsService) {
        platform.ready().then(() => {
            // Load objectives before enter in app
            objectifsService.getAll(false);
            objectifsService.getAll(true);
            statusBar.styleBlackTranslucent();
            splashScreen.hide();
        });

        if (isDevMode()) {
            console.log('%cThis app run in dev mode', 'color: red; font-size: 20px;');
        }

        if (platform.is('cordova')) {
            console.log('%cThis app run on a real device, log in alert activated', 'color: red; font-size: 20px;');            
        }
    }
}

