import { Injectable } from "@angular/core";
import { AppConstants } from "@appPRN/app.constants";
import {
  ILocalNotification,
  LocalNotifications,
} from "@ionic-native/local-notifications";
import { Objectif } from "@modelsPRN/objectif.model";
import { DateService } from "@servicesPRN/date.service";
import { UiService } from "./ui.service";
import { Storage } from "@ionic/storage";
import { SettingsService } from "./settings.service";

@Injectable()
export class NotificationsService {
  constructor(
    private localNotifications: LocalNotifications,
    private dateService: DateService,
    private uiService: UiService,
    private settingsService: SettingsService,
    private storage: Storage
  ) { }

  public add(objectif: Objectif, number = 1): void {
    const id: number = this.getId(objectif);
    let notification: ILocalNotification;

    this.checkPermission().then(status => {
      if (!status) {
        return;
      }

      this.localNotifications.isPresent(id).then((present: boolean) => {
        if (present) {
          this.get(id).then((notificationBase: ILocalNotification) => {
            notification = notificationBase;

            notification.badge += number;


            if (notification.badge === 1) {
              notification.title = "Objectif en attente"
              notification.text = "Vous avez un objectif non-atteint";
            } else {
              notification.title = "Objectifs en attente"
              notification.text = `Vous avez ${
                notification.badge
                } objectifs non-atteints`;
            }

            this.update(notification).then(() => { });
          });
        } else {
          let date: Date = this.dateService.getDateFromString(objectif.date);
          const hoursSettings: {
            hour: number;
            min: number;
          } = this.getHoursSettings();

          // const dateTest = new Date();
          // dateTest.setMinutes(dateTest.getMinutes() + 2);

          date.setHours(
            hoursSettings.hour,
            hoursSettings.min,
            AppConstants.notificationsDefaultParameters.hourOfDay.sec,
            AppConstants.notificationsDefaultParameters.hourOfDay.ms
          );

          let text: string;
          let title: string;

          if (number === 1) {
            text = "Vous avez un objectif non-atteint";
            title = "Objectif en attente";
          } else {
            text = `Vous avez ${number} objectifs non-atteints`;
            title = "Objectifs en attente";
          }

          notification = {
            id: id,
            title: title,
            text: text,
            badge: number,
            autoClear: AppConstants.notificationsDefaultParameters.autoClear,
            trigger: { at: date },
            smallIcon: "res://n_icon.png",
            color: '#1976D2'
          };

          this.schedule(notification).then(() => { });
        }
      });
    });
  }

  public updateHours(): Promise<void> {
    return new Promise((resolve, reject) => {
      const hoursSettings: {
        hour: number;
        min: number;
      } = this.getHoursSettings();

      this.getAll().then((notifications: ILocalNotification[]) => {
        notifications.forEach((notification: ILocalNotification) => {
          let date: Date = new Date(notification.trigger.at);

          date.setHours(hoursSettings.hour);
          date.setMinutes(hoursSettings.min);

          notification.trigger.at = date;
          this.update(notification).then(() => { });
        });

        resolve();
      });
    });
  }

  public disable(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.getAll().then((notifications: ILocalNotification[]) => {
        this.storage
          .set(AppConstants.storageNames.disabledNotifications, notifications)
          .then(() => {
            this.localNotifications.cancelAll().then(() => {
              resolve();
            });
          });
      });
    });
  }

  public enable(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.storage
        .get(AppConstants.storageNames.disabledNotifications)
        .then((notifications: ILocalNotification[]) => {
          if (notifications != null && notifications.length > 0) {
            this.localNotifications.schedule(notifications);
            this.storage
              .remove(AppConstants.storageNames.disabledNotifications)
              .then(() => {
                this.localNotifications.clearAll().then(() => {
                  resolve();
                });
              });
          }
        });
    });
  }

  private getHoursSettings(): { hour: number; min: number } {
    let hoursString: string = this.settingsService.get("notificationsHours");

    return {
      hour: Number(hoursString.split(":")[0]),
      min: Number(hoursString.split(":")[1])
    };
  }

  public delete(objectif: Objectif, number = 1): Promise<void> {
    return new Promise((resolve, reject) => {
      const id: number = this.getId(objectif);

      this.get(id).then((notification: ILocalNotification) => {
        if (notification.badge === number) {
          this.cancel(id).then((res: any) => { });
        } else {
          notification.badge = notification.badge - number;

          if (notification.badge === 1) {
            notification.title = "Objectif en attente"
            notification.text = "Vous avez un objectif non-atteint";
          } else {
            notification.title = "Objectifs en attente"
            notification.text = `Vous avez ${
              notification.badge
              } objectifs non-atteints`;
          }

          this.update(notification).then(() => {
            resolve();
          });
        }
      });
    });
  }

  public updateTitle(objectif: Objectif, oldTitle: string): void {
    // const id: number = this.getId(objectif);

    // this.get(id).then((notification: ILocalNotification) => {
    //   // if (typeof notification.text === "string") {
    //   //   notification.text = objectif.title;
    //   // } else {
    //   //   for (let i = 0; i < notification.text.length; i++) {
    //   //     if (notification.text[i] === oldTitle) {
    //   //       notification.text[i] = objectif.title;
    //   //       break;
    //   //     }
    //   //   }
    //   // }

    //   // let notificationText: string = notification.text.toString();
    //   // notificationText.replace(oldTitle, objectif.title);
    //   // notification.text = notificationText;

    //   this.update(notification).then(() => {});
    // });
  }

  private get(id: number): Promise<ILocalNotification> {
    return new Promise((resolve, reject) => {
      // if (this.settingsService.get('notifications')) {
      this.localNotifications
        .get(id)
        .then((notification: ILocalNotification) => {
          resolve(notification);
        });
      // } else {
      //     this.storage.get(AppConstants.storageNames.disabledNotifications).then((notifications: ILocalNotification[]) => {
      //         notifications.forEach((notification: ILocalNotification) => {
      //             if (notification.id === id) {
      //                 resolve(notification);
      //                 return;
      //             }
      //         });
      //     });
      // }
    });
  }

  private update(notificationNew: ILocalNotification): Promise<void> {
    return new Promise((resolve, reject) => {
      //   if (this.settingsService.get("notifications")) {
      this.localNotifications.update(notificationNew);
      resolve();
      //   } else {
      //     this.storage
      //       .get(AppConstants.storageNames.disabledNotifications)
      //       .then((notifications: ILocalNotification[]) => {
      //         notifications.forEach((notification: ILocalNotification) => {
      //           if (notification.id === notificationNew.id) {
      //             notification = notificationNew;

      //             this.storage
      //               .set(
      //                 AppConstants.storageNames.disabledNotifications,
      //                 notifications
      //               )
      //               .then(() => {
      //                 resolve();
      //                 return;
      //               });
      //           }
      //         });
      //       });
      //   }
    });
  }

  private schedule(notification: ILocalNotification): Promise<void> {
    return new Promise((resolve, reject) => {
      //   if (this.settingsService.get("notifications")) {
      this.localNotifications.schedule(notification);
      resolve();
      //   } else {
      //     this.storage
      //       .get(AppConstants.storageNames.disabledNotifications)
      //       .then((notifications: ILocalNotification[]) => {
      //         notifications.push(notification);

      //         this.storage
      //           .set(
      //             AppConstants.storageNames.disabledNotifications,
      //             notifications
      //           )
      //           .then(() => {
      //             resolve();
      //           });
      //       });
      //   }
    });
  }

  private getAll(): Promise<ILocalNotification[]> {
    return new Promise((resolve, reject) => {
      //   if (this.settingsService.get("notifications")) {
      this.localNotifications
        .getAll()
        .then((notifications: ILocalNotification[]) => {
          resolve(notifications);
        });
      //   } else {
      //     this.storage
      //       .get(AppConstants.storageNames.disabledNotifications)
      //       .then((notifications: ILocalNotification[]) => {
      //         resolve(notifications);
      //       });
      //   }
    });
  }
  private cancel(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      //   if (this.settingsService.get("notifications")) {
      this.localNotifications.cancel(id).then((res: any) => {
        resolve();
      });
      //   } else {
      //     this.storage
      //       .get(AppConstants.storageNames.disabledNotifications)
      //       .then((notifications: ILocalNotification[]) => {
      //         for (let i = 0; i < notifications.length; i++) {
      //           if (notifications[i].id === id) {
      //             notifications.splice(i, 1);
      //             resolve();
      //             break;
      //           }
      //         }
      //       });
      //   }
    });
  }

  private getId(objectif: Objectif): number {
    return Number(objectif.date.split("/").join(""));
  }

  public checkPermission(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.localNotifications.requestPermission().then((status: boolean) => {
        if (!status) {
          this.uiService.displayToast("Vous ne recevrez pas de notifications");
        }
        resolve(status);
      });
    });
  }
}
