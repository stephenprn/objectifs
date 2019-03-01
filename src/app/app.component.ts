import { Component, isDevMode } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { ObjectifsPage } from '@pagesPRN/objectifs/objectifs';
import { Platform } from 'ionic-angular';

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    rootPage: any = ObjectifsPage;

    constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleBlackTranslucent();
            splashScreen.hide();
        });

        if (isDevMode()) {
            console.log('%cThis app run in dev mode', 'color: red; font-size: 20px;');
        }
    }
}

