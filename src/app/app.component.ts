import { Component, isDevMode } from "@angular/core";
import { StatusBar } from "@ionic-native/status-bar";
import { ObjectifsPage } from "@pagesPRN/objectifs/objectifs.page";
import { ObjectifsService } from "@servicesPRN/objectifs.service";
import { Platform, ModalController } from "ionic-angular";
import { AchievementsService } from "@servicesPRN/achievements.service";
import { ObjectifsLaterService } from "@servicesPRN/objectifs-later.service";
import { SuggestionsService } from "@servicesPRN/suggestions.service";
import { SettingsService } from "@servicesPRN/settings.service";
import { PasswordPage } from "@pagesPRN/password/password.page";
import { SplashscreenPage } from "@pagesPRN/splashscreen/splashscreen.page";
import { SplashScreen } from "@ionic-native/splash-screen";
import { AppConstants } from "./app.constants";

@Component({
  templateUrl: "app.html",
})
export class MyApp {
  rootPage: any;

  constructor(
    private platform: Platform,
    statusBar: StatusBar,
    objectifsService: ObjectifsService,
    achievementsService: AchievementsService,
    objectifsLaterService: ObjectifsLaterService,
    suggestionsService: SuggestionsService,
    settingsService: SettingsService,
    modalCtrl: ModalController,
    public splashScreen: SplashScreen
  ) {
    this.splashScreen.hide();
    platform.ready().then(() => {
      let splash = modalCtrl.create(SplashscreenPage);
      splash.present();

      // Load all stored data before enter in app
      let promises = [];
      const time = new Date().getTime();

      promises.push(objectifsService.loadStored(false));
      promises.push(objectifsService.loadStored(true));
      promises.push(achievementsService.loadStored());
      promises.push(objectifsLaterService.loadStored());
      promises.push(suggestionsService.getCategoriesUsages());
      promises.push(suggestionsService.loadStored());
      promises.push(objectifsService.loadStoredId(false));
      promises.push(objectifsService.loadStoredId(true));
      promises.push(settingsService.loadStored());

      Promise.all(promises).then(() => {
        console.log("all promises done");
        if (isDevMode()) {
          console.log(
            `Data has been loaded in ${
              new Date().getTime() - time
            } ms`
          );
        }

        statusBar.backgroundColorByHexString("#424250");
        this.rootPage = SplashscreenPage;

        // We wait for the splashcreen animation to be finished
        setTimeout(() => {
          if (settingsService.isPasswordActivated()) {
            this.rootPage = PasswordPage;
          } else {
            this.rootPage = ObjectifsPage;
          }
        }, AppConstants.SPLASHSCREEN_CONFIG.INTERVAL_DURATION * AppConstants.SPLASHSCREEN_CONFIG.INTERVAL_NBR);
      });

      this.logInfos();
    });
  }

  private logInfos() {
    if (isDevMode()) {
      console.log("%cThis app run in dev mode", "color: red; font-size: 20px;");
    }

    if (this.platform.is("cordova")) {
      console.log(
        "%cThis app run on a real device, log in alert activated",
        "color: red; font-size: 20px;"
      );
    }
  }
}
