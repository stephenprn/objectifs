import { Injectable } from '@angular/core';
import { AppConstants } from '@appPRN/app.constants';
import { ILocalNotification, LocalNotifications } from '@ionic-native/local-notifications';
import { Objectif } from '@modelsPRN/objectif.model';
import { DateService } from '@servicesPRN/date.service';
import { UiService } from './ui.service';

@Injectable()
export class NotificationsService {
    constructor(private localNotifications: LocalNotifications, private dateService: DateService,
        private uiService: UiService) { }

    public add(objectif: Objectif): void {
        const id: number = this.getId(objectif);
        let notification: ILocalNotification;

        this.checkPermission();

        this.localNotifications.isPresent(id).then((present: boolean) => {
            if (present) {
                this.localNotifications.get(id).then((notificationBase: ILocalNotification) => {
                    notification = notificationBase;

                    notification.badge++;
                    notification.title = `Vous avez ${notification.badge} objectifs non-atteints`;

                    if (typeof notification.text === 'string') {
                        notification.text = [notification.text, objectif.title];
                    } else if (notification.text.length < AppConstants.notificationsDefaultParameters.nbrLinesMax) {
                        notification.text.push(objectif.title);
                    }

                    this.localNotifications.update(notification);
                });
            } else {
                let date: Date = this.dateService.getDateFromString(objectif.date);

                date.setHours(
                    AppConstants.notificationsDefaultParameters.hourOfDay.hours,
                    AppConstants.notificationsDefaultParameters.hourOfDay.min,
                    AppConstants.notificationsDefaultParameters.hourOfDay.sec,
                    AppConstants.notificationsDefaultParameters.hourOfDay.ms
                );

                notification = {
                    id: id,
                    title: 'Vous avez un objectif non-atteint',
                    text: [objectif.title],
                    badge: 1,
                    trigger: { at: date }
                };

                this.localNotifications.schedule(notification);
            }
        });
    }

    public delete(objectif: Objectif): void {
        const id: number = this.getId(objectif);

        this.localNotifications.get(id).then((notification: ILocalNotification) => {
            if (notification.badge === 1) {
                this.localNotifications.cancel(id).then((res: any) => {
                });
            } else {
                notification.badge--;
                notification.title = `Vous avez ${notification.badge} objectifs non-atteints`;

                for (let i = 0; i < notification.text.length; i++) {
                    if (notification.text[i] === objectif.title) {
                        notification.text.slice(i, 1);
                        break;
                    }
                }

                this.localNotifications.update(notification);
            }
        });
    }

    public updateTitle(objectif: Objectif, oldTitle: string): void {
        const id: number = this.getId(objectif);

        this.localNotifications.get(id).then((notification: ILocalNotification) => {
            if (typeof notification.text === 'string') {
                notification.text = objectif.title;
            } else {
                for (let i = 0; i < notification.text.length; i++) {
                    if (notification.text[i] === oldTitle) {
                        notification.text[i] = objectif.title;
                        break;
                    }
                }
            }

            this.localNotifications.update(notification);
        });
    }

    private getId(objectif: Objectif): number {
        return Number(objectif.date.replace('/', ''));
    }

    public checkPermission(): void {
        this.localNotifications.requestPermission().then((status: boolean) => {
            if (!status) {
                this.uiService.displayToast('Vous ne recevrez pas de notifications');
            }
        });
    }
}