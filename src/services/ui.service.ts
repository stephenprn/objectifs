import { SuggestionsService } from "./suggestions.service";
import { ObjectifsLaterService } from "@servicesPRN/objectifs-later.service";
import { Injectable } from "@angular/core";
import { AppConstants } from "@appPRN/app.constants";
import {
  Alert,
  AlertController,
  ToastController,
  ToastOptions,
  Toast
} from "ionic-angular";
import _ from "lodash";

@Injectable()
export class UiService {
  constructor(
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private objectifsLaterService: ObjectifsLaterService,
    private suggestionsService: SuggestionsService
  ) {}

  public displayToast(text: string): void {
    let options: ToastOptions = _.cloneDeep(AppConstants.toastDefaultConfig);
    options.message = text;

    this.toastCtrl.create(options).present();
  }

  public displayToastDeleteSug(sug: string) {
    let options: ToastOptions = _.cloneDeep(AppConstants.toastDefaultConfig);

    options.cssClass = "toast-remove";
    options.duration = AppConstants.draftToastDuration;
    options.message = "Suggestion supprimée";
    options.showCloseButton = true;
    options.closeButtonText = "Annuler";

    let toast: Toast = this.toastCtrl.create(options);

    toast.onDidDismiss((data: any, role: string) => {
      if (role === "close") {
        this.suggestionsService.save(sug);
      }
    });

    toast.present();
  }

  public displayToastDraft(idObj: number): void {
    let options: ToastOptions = _.cloneDeep(AppConstants.toastDefaultConfig);

    options.cssClass = "toast-remove";
    options.duration = AppConstants.draftToastDuration;
    options.message = "Brouillon sauvegardé";
    options.showCloseButton = true;
    options.closeButtonText = "Supprimer";

    let toast: Toast = this.toastCtrl.create(options);

    toast.onDidDismiss((data: any, role: string) => {
      if (role === "close") {
        this.objectifsLaterService.remove(idObj);
      }
    });

    toast.present();
  }

  public displaySimpleAlert(title: string, subTitle: string, message?: string) {
    const alert: Alert = this.alertCtrl.create({
      title: title,
      enableBackdropDismiss: true,
      subTitle: subTitle,
      message: message,
      buttons: ["OK"]
    });

    alert.present();
  }
}
