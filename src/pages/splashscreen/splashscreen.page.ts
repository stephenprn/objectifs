import { Component } from "@angular/core";
import { ViewController } from "ionic-angular";
import { SplashScreen } from "@ionic-native/splash-screen";

@Component({
  selector: "page-splashcreen",
  templateUrl: "splashscreen.page.html"
})
export class SplashscreenPage {
  elementsShowed = {
    mountain1: { showed: false, index: 0 },
    mountain2: { showed: false, index: 1 },
    mountain3: { showed: false, index: 2 },
    logo: { showed: false, index: 3 }
  };
  INTERVAL_DURATION = 750;

  constructor(
    public viewCtrl: ViewController,
    public splashScreen: SplashScreen
  ) {
    for (const elt in this.elementsShowed) {
      console.log(elt);
      setTimeout(() => {
        this.elementsShowed[elt].showed = true;
      }, this.elementsShowed[elt].index * this.INTERVAL_DURATION);
    }
  }

  ionViewDidEnter() {
    this.splashScreen.hide();

    setTimeout(() => {
      this.viewCtrl.dismiss();
    }, this.INTERVAL_DURATION * 5);
  }
}
