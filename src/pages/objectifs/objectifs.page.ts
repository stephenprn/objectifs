import { DraftsPage } from '@pagesPRN/drafts/drafts.page';
import { UiService } from '@servicesPRN/ui.service';
import { Component, ViewChild } from "@angular/core";
import { AppConstants } from "@appPRN/app.constants";
import { DatePicker, DatePickerOptions } from "@ionic-native/date-picker";
import { Keyboard } from "@ionic-native/keyboard";
import { Day } from "@modelsPRN/day.model";
import { Objectif } from "@modelsPRN/objectif.model";
import { Stats } from "@modelsPRN/stats.model";
import { AddObjectifPage } from "@pagesPRN/add-objectif/add-objectif.page";
import { WeekStatsPage } from "@pagesPRN/stats/week-stats/week-stats.page";
import { DateService } from "@servicesPRN/date.service";
import { NotificationsService } from "@servicesPRN/notifications.service";
import { ObjectifsLaterService } from "@servicesPRN/objectifs-later.service";
import { ObjectifsService } from "@servicesPRN/objectifs.service";
import { StatsService } from "@servicesPRN/stats.service";
import { UtilsService } from "@servicesPRN/utils.service";
import {
  ActionSheet,
  ActionSheetButton,
  ActionSheetController,
  Alert,
  AlertButton,
  AlertController,
  FabContainer,
  Modal,
  ModalController,
  NavController,
  Slides
} from "ionic-angular";
import _ from "lodash";
import { SettingsPage } from "@pagesPRN/settings/settings.page";
import { StatsPage } from "@pagesPRN/stats/stats.page";

@Component({
  selector: "page-objectifs",
  templateUrl: "objectifs.page.html"
})
export class ObjectifsPage {
  @ViewChild(Slides) slides: Slides;

  objectifs: Objectif[];
  objectifsWeek: Objectif[];
  days: Day[];
  nbrDaysDisplayed: number;
  weekStats: Stats;
  categoriesJson: any;
  importancesJson: any;
  private week1: Date;
  limitDescription: number;
  bigSlides: boolean = true;
  dateFormat: string = AppConstants.dateFormat;
  selectMode: boolean = false;
  pressed: boolean = false;
  // It's a string because it can be equal to '99+'
  nbrLater: string;
  updatingObj: boolean = false;
  backDrop: { displayed: boolean; active: boolean; timeOut: any } = {
    displayed: false,
    active: false,
    timeOut: null
  };

  constructor(
    public navCtrl: NavController,
    private objectifsService: ObjectifsService,
    public modalCtrl: ModalController,
    private dateService: DateService,
    public actionSheetCtrl: ActionSheetController,
    private datePicker: DatePicker,
    private statsService: StatsService,
    private alertCtrl: AlertController,
    private objectifsLaterService: ObjectifsLaterService,
    private utilsService: UtilsService,
    private keyboard: Keyboard,
    private notificationsService: NotificationsService,
    private uiService: UiService
  ) {
    // Useful for checkWeekStats()
    this.week1 = new Date(new Date().getFullYear(), 0, 4);

    this.categoriesJson = this.utilsService.getObjectFromArray(
      "id",
      ["title", "icon", "color"],
      AppConstants.categories
    );
    this.importancesJson = this.utilsService.getObjectFromArray(
      "id",
      ["icon", "color", "index", "title"],
      AppConstants.importances
    );

    this.limitDescription = AppConstants.limitDescription;
    this.nbrDaysDisplayed = AppConstants.nbrDaysDisplayed;

    this.objectifs = this.objectifsService.getAll();
    this.initDays(null, null, null, true);
    this.nbrLater = this.objectifsLaterService.getNbr();
  }

  initDays(
    addBegin: boolean,
    currentIndex: number,
    date?: Date,
    firstInit?: boolean
  ): void {
    if (!date) {
      date = new Date();
    }

    let nbrDays: number;
    this.dateService.getCloseDays(date);

    // If addBegin is null, we totally reinitialize the days
    if (addBegin === null) {
      this.days = [];

      date.setDate(date.getDate() - this.nbrDaysDisplayed);

      nbrDays = 2 * this.nbrDaysDisplayed;
    } else {
      if (addBegin) {
        date = this.dateService.getDateFromString(this.days[0].date);
      } else {
        date = this.dateService.getDateFromString(
          this.days[this.days.length - 1].date
        );
      }

      nbrDays = this.nbrDaysDisplayed;
    }

    for (let i = 0; i < nbrDays; i++) {
      this.constructDay(addBegin, date);
    }

    // If we reinitialize completely the days, we must go to the right slide
    if (addBegin == null && currentIndex == null && !firstInit) {
      setTimeout(() => {
        this.slides.slideTo(this.nbrDaysDisplayed - 1, 0, false);
      });
    }

    // If we add days at the begining, the index of the current slide changed
    if (addBegin !== null && addBegin === true) {
      setTimeout(() => {
        this.slides.slideTo(
          currentIndex.valueOf() + this.nbrDaysDisplayed,
          0,
          false
        );
      });
    }
  }

  report(obj: Objectif): void {
    this.datePicker
      .show({
        date: this.dateService.getDateFromString(obj.date),
        mode: "date",
        androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
      })
      .then(
        (date: Date) => {
          obj.reportCount++;

          this.notificationsService.delete(obj).then(() => { });
          obj.date = this.dateService.getStringFromDate(date);
          this.notificationsService.add(obj);

          this.objectifsService.saveChanges().then(() => {
            this.initDays(null, null, date);

            setTimeout(() => {
              this.checkWeekStats(true);
            }, 100);
          });
        },
        (err: any) => {
          console.error(err);
        }
      );
  }

  goToDay(initialDate: string): void {
    let options: DatePickerOptions = AppConstants.datepickerDefaultConfig;
    options.date = this.dateService.getDateFromString(initialDate);

    this.datePicker.show(options).then(
      (date: Date) => {
        this.deselectAll();
        this.initDays(null, null, date);
        this.checkWeekStats(true, date);
      },
      (err: any) => {
        console.error(err);
      }
    );
  }

  setDone(obj: Objectif, done: boolean): void {
    obj.done = done;

    // Update number of objectives done
    if (done) {
      this.getCurrentDay().stats.done++;
      this.weekStats.done++;
      this.notificationsService.delete(obj).then(() => { });
    } else {
      this.getCurrentDay().stats.done--;
      this.weekStats.done--;
      this.notificationsService.add(obj);
    }

    // Reorder objectives after status change
    this.objectifsService.orderObjectives(
      this.getCurrentDay().objectifs,
      this.importancesJson
    );
    this.objectifsService.saveChanges();

    
    obj.slide = true;
    
    setTimeout(() => {
      delete obj.slide;
    }, 500);
  }

  objectifClicked(obj: Objectif): void {
    if (this.pressed) {
      this.pressed = false;
      return;
    }

    if (this.selectMode) {
      obj.selected = !obj.selected;

      if (!this.objectifs.some(obj => obj.selected)) {
        this.selectMode = false;
      }
    } else {
      this.showActions(obj);
    }
  }

  showActions(obj: Objectif): void {
    // Buttons that are displayed in the action sheet
    let buttons: ActionSheetButton[] = [
      {
        text: "Supprimer",
        cssClass: "redText",
        handler: () => {
          this.updatingObj = true;
          this.showDelete(obj);
          return true;
        }
      },
      {
        text: "Annuler",
        role: "cancel"
      }
    ];

    if (!obj.done) {
      buttons.unshift({
        text: "Modifier",
        handler: () => {
          this.updatingObj = true;
          // this.showUpdate(obj);
          this.openUpdateModale(obj);
          return true;
        }
      });
    }

    if (obj.reportable && !obj.done) {
      buttons.unshift({
        text: "Reporter",
        handler: () => {
          this.report(obj);
          return true;
        }
      });
    }

    if (obj.done) {
      buttons.unshift({
        text: "Objectif non-atteint...",
        handler: () => {
          this.setDone(obj, false);
        }
      });
    } else {
      buttons.unshift({
        text: "Objectif atteint !",
        handler: () => {
          this.setDone(obj, true);
        }
      });
    }

    const actionSheet: ActionSheet = this.actionSheetCtrl.create({
      title: obj.title,
      buttons: buttons
    });

    actionSheet.present();
  }

  closeFab(fab: FabContainer) {
    fab.close();
    this.setBackDrop(false);
  }

  showDrafts(event: any, fab: FabContainer) {
    this.deselectAll();
    const modal: Modal = this.modalCtrl.create(DraftsPage);

    this.setBackDrop(false);
    modal.present();
    fab.close();
  }

  showSettings(event: any, fab: FabContainer) {
    this.deselectAll();
    const modal: Modal = this.modalCtrl.create(SettingsPage);

    this.setBackDrop(false);
    modal.present();
    fab.close();
  }

  showStats(event: any, fab: FabContainer) {
    this.deselectAll();

    const currentDate: Date = this.dateService.getDateFromString(
      this.getCurrentDay().date
    );

    const modal: Modal = this.modalCtrl.create(StatsPage, {
      date: currentDate
    });

    this.setBackDrop(false);
    modal.present();

    if (fab) {
      fab.close();
    }
  }

  openUpdateModale(objectif: Objectif): void {
    let objectifCopy = _.cloneDeep(objectif);

    const modal: Modal = this.modalCtrl.create(AddObjectifPage, { objectif: objectifCopy });

    modal.present();

    modal.onDidDismiss((obj: Objectif) => {
      if (obj != null) {
        const date: Date = this.dateService.getDateFromString(obj.date);
        this.initDays(null, null, date);
        this.nbrLater = this.objectifsLaterService.getNbr();

        setTimeout(() => {
          this.checkWeekStats(true);
        }, 100);
      }
    });
  }

  showAdd(event: any, fab: FabContainer): void {
    //Get the date of the current slide and convert it to format YYYY-MM-DD
    const date: string = this.dateService.formatDateString(
      this.getCurrentDay().date,
      true
    );
    const modal: Modal = this.modalCtrl.create(AddObjectifPage, { date: date });

    this.setBackDrop(false);
    modal.present();

    if (fab) {
      fab.close();
    }

    modal.onDidDismiss((obj: Objectif) => {
      if (obj != null) {
        const date: Date = this.dateService.getDateFromString(obj.date);
        this.initDays(null, null, date);

        setTimeout(() => {
          this.checkWeekStats(true);
        }, 100);
      }

      this.nbrLater = this.objectifsLaterService.getNbr();

      setTimeout(() => {
        this.nbrLater = this.objectifsLaterService.getNbr();
      }, AppConstants.draftToastDuration);
    });
  }

  showUpdate(objectif: Objectif): void {
    const alert: Alert = this.alertCtrl.create({
      title: "Modifier un objectif",
      enableBackdropDismiss: true,
      inputs: [
        {
          name: "title",
          placeholder: "Titre",
          value: objectif.title
        },
        {
          name: "description",
          placeholder: "Description",
          value: objectif.description
        }
      ],
      buttons: [
        {
          text: "Annuler",
          role: "cancel"
        },
        {
          text: "Détails",
          handler: (data: any) => {
            let objCopy: Objectif = _.cloneDeep(objectif);

            objCopy.title = data.title;
            objCopy.description = data.description;

            this.openUpdateModale(objCopy);
          }
        },
        {
          text: "Sauv.",
          handler: (data: any) => {
            if (data.title == null || data.title == "") {
              this.uiService.displayToast('Vous devez entrer un titre')
              return false;
            }

            const oldTitle: string = _.cloneDeep(objectif.title);

            objectif.title = data.title;
            objectif.description = data.description;

            this.objectifsService.update(objectif);
            this.notificationsService.updateTitle(objectif, oldTitle);
          }
        }
      ]
    });

    alert.present();

    this.keyboard.show();
  }

  showDelete(objectif: Objectif): void {
    let buttons: AlertButton[] = [
      {
        text: "Supprimer",
        cssClass: 'redText',
        handler: () => {
          this.objectifsService.delete(objectif);
          this.notificationsService.delete(objectif).then(() => { });
          this.deleteObjectifFromDay(objectif);
          this.updatingObj = false;
          this.checkWeekStats(true);
        }
      },
      {
        text: "Annuler",
        role: "destructive"
      }
    ];

    let subTitle: string;

    if (objectif.idPeriodic != null) {
      subTitle = "Cet objectif est périodique. Vous voulez supprimer :";
      buttons[0].text = "Uniquement cet obj.";

      buttons.unshift({
        text: "Tous les obj. associés",
        cssClass: 'redText',
        handler: () => {
          const objectifs: Objectif[] = this.objectifsService.filterObjectifs([
            { criteria: "idPeriodic", value: objectif.idPeriodic }
          ]);

          objectifs.forEach((obj: Objectif) => {
            this.objectifsService.delete(obj);
            this.notificationsService.delete(objectif).then(() => { });
            this.deleteObjectifFromAllDays(obj);
          });

          this.updatingObj = false;
          this.checkWeekStats(true);
        }
      });

      buttons.unshift({
        text: "Les obj. associés à venir",
        cssClass: 'redText',
        handler: () => {
          const objectifs: Objectif[] = this.objectifsService.filterObjectifs([
            { criteria: "idPeriodic", value: objectif.idPeriodic },
            {
              criteria: "date",
              value: ">=DATE" + AppConstants.separator + objectif.date,
              custom: true
            }
          ]);

          objectifs.forEach((obj: Objectif) => {
            this.objectifsService.delete(obj);
            this.notificationsService.delete(objectif).then(() => { });
            this.deleteObjectifFromAllDays(obj);
          });

          this.updatingObj = false;
          this.checkWeekStats(true);
        }
      });

      buttons.unshift({
        text: "Les obj. associés passés",
        cssClass: 'redText',
        handler: () => {
          const objectifs: Objectif[] = this.objectifsService.filterObjectifs([
            { criteria: "idPeriodic", value: objectif.idPeriodic },
            {
              criteria: "date",
              value: "<=DATE" + AppConstants.separator + objectif.date,
              custom: true
            }
          ]);

          objectifs.forEach((obj: Objectif) => {
            this.objectifsService.delete(obj);
            this.notificationsService.delete(objectif).then(() => { });
            this.deleteObjectifFromAllDays(obj);
          });

          this.updatingObj = false;
          this.checkWeekStats(true);
        }
      });
    } else {
      subTitle = "Voulez-vous vraiment supprimer cet objectif ?";
    }

    let alert: Alert = this.alertCtrl.create({
      title: "Supprimer un objectif",
      subTitle: subTitle,
      enableBackdropDismiss: true,
      buttons: buttons
    });

    alert.present();
  }

  showAddLater(event: any, fab: FabContainer): void {
    this.deselectAll();

    const alert: Alert = this.alertCtrl.create({
      title: "Ajouter pour plus tard",
      message: "Objectif que vous pourrez programmer plus tard",
      enableBackdropDismiss: true,
      inputs: [
        {
          name: "title",
          placeholder: "Titre"
        },
        {
          name: "description",
          placeholder: "Description"
        }
      ],
      buttons: [
        {
          text: "Annuler"
        },
        {
          text: "Sauvegarder",
          handler: (data: any) => {
            this.objectifsLaterService.add(data).then(() => {
              this.nbrLater = this.objectifsLaterService.getNbr();
            });
          }
        }
      ]
    });

    this.setBackDrop(false);
    alert.present();
    fab.close();
  }

  slideDidChange(): void {
    this.deselectAll();
    this.checkWeekStats();
    const currentIndex: number = this.slides.getActiveIndex();

    if (currentIndex == null) {
      return;
    }

    if (currentIndex < AppConstants.indexTriggerCache) {
      this.initDays(true, currentIndex);
    } else if (
      currentIndex >=
      this.days.length - AppConstants.indexTriggerCache
    ) {
      this.initDays(false, null);
    }
  }

  checkWeekStats(reset?: boolean, date?: Date, resetAll?: boolean): void {
    //Get week from the current day
    if (!date) {
      date = this.dateService.getDateFromString(this.getCurrentDay().date);
    }

    date.setDate(date.getDate() - ((date.getDay() + 6) % 7));

    const weekNbr: number =
      1 +
      Math.round(
        ((date.getTime() - this.week1.getTime()) / 86400000 -
          3 +
          ((this.week1.getDay() + 6) % 7)) /
        7
      );

    if (!reset && this.weekStats && this.weekStats.weekNbr === weekNbr) {
      return;
    }

    let sunday: Date = _.cloneDeep(date);
    sunday.setDate(sunday.getDate() + 6);

    this.objectifsWeek = this.objectifsService.filterObjectifs([
      {
        criteria: "date",
        value:
          ">=DATE" +
          AppConstants.separator +
          this.dateService.getStringFromDate(date),
        custom: true
      },
      {
        criteria: "date",
        value:
          "<=DATE" +
          AppConstants.separator +
          this.dateService.getStringFromDate(sunday),
        custom: true
      }
    ]);

    this.weekStats = this.statsService.getStats(this.objectifsWeek);
    this.weekStats.weekNbr = weekNbr;

    if (this.weekStats.isEmpty()) {
      this.bigSlides = true;
    } else {
      this.bigSlides = false;
    }
  }

  openWeekStats() {
    const currentDate: Date = this.dateService.getDateFromString(
      this.getCurrentDay().date
    );
    const modal: Modal = this.modalCtrl.create(WeekStatsPage, {
      date: currentDate,
      modalMode: true
    });
    modal.present();
  }

  setBackDrop(state?: boolean) {
    if (state == null) {
      state = !this.backDrop.displayed;
    }

    this.backDrop.displayed = state;

    if (this.backDrop.timeOut != null) {
      clearTimeout(this.backDrop.timeOut);
    }

    if (this.backDrop.displayed) {
      this.backDrop.active = this.backDrop.displayed;
    } else {
      this.backDrop.timeOut = setTimeout(() => {
        this.backDrop.timeOut = null;
        this.backDrop.active = this.backDrop.displayed;
      }, 500);
    }
  }

  // UTILS FUNCTIONS

  private constructDay(addBegin: boolean, date: Date): void {
    if (addBegin === null || addBegin === false) {
      date.setDate(date.getDate() + 1);
    } else {
      date.setDate(date.getDate() - 1);
    }

    let day: Day = new Day();

    day.dateObject = _.cloneDeep(date);
    day.date = this.dateService.getStringFromDate(date);
    day.objectifs = this.objectifs.filter((obj: Objectif) => {
      return obj.date === day.date;
    });

    this.objectifsService.orderObjectives(day.objectifs, this.importancesJson);

    day.stats = this.statsService.getStats(day.objectifs);

    // We replace the date by yesterday, today or tomorrow
    if (addBegin === null) {
      this.dateService.checkCloseDay(day);
    }

    if (addBegin === null || addBegin === false) {
      this.days.push(day);
    } else {
      this.days.unshift(day);
    }
  }

  private deleteObjectifFromDay(objectif: Objectif, day?: Day): boolean {
    if (!day) {
      day = this.getCurrentDay();
    }

    for (let i = 0; i < day.objectifs.length; i++) {
      if (day.objectifs[i].id === objectif.id) {
        day.objectifs.splice(i, 1);
        return true;
      }
    }

    return false;
  }

  private deleteObjectifFromAllDays(objectif: Objectif): void {
    for (let i = 0; i < this.days.length; i++) {
      if (this.deleteObjectifFromDay(objectif, this.days[i])) {
        break;
      }
    }
  }

  private getCurrentDay(): Day {
    return this.days[this.slides.getActiveIndex()];
  }

  trackObjectifsFunction(index: number, objectif: Objectif) {
    if (!objectif) {
      return null;
    }

    return objectif.id;
  }

  trackDaysFunction(index: number, day: Day) {
    if (!day) {
      return null;
    }

    return day.date;
  }

  select(obj: Objectif): void {
    if (this.selectMode) {
      obj.selected = !obj.selected;

      if (!this.objectifs.some(obj => obj.selected)) {
        this.selectMode = false;
      }
    } else {
      this.selectMode = true;
      obj.selected = true;
      this.pressed = true;
    }
  }

  deselectAll(): void {
    this.selectMode = false;
    this.objectifs.forEach(obj => obj.selected = false);
  }

  checkSelection(): void {
    const objectifs = this.objectifs.filter(obj => obj.selected);
    
    for (const obj of objectifs) {
      this.setDone(obj, true);
    }
    
    this.deselectAll();
  }

  deleteSelection(): void {
    let alert: Alert = this.alertCtrl.create({
      title: "Supprimer la sélection",
      subTitle: "Les objectifs selctionnés seront supprimés définitivement.",
      enableBackdropDismiss: true,
      buttons: [
        {
          text: "Annuler",
          role: "destructive"
        },
        {
          text: "Supprimer",
          cssClass: 'redText',
          handler: () => {
            const objectifs = this.objectifs.filter(obj => obj.selected);

            if (objectifs == null || objectifs.length === 0) {
              return;
            }

            this.notificationsService.delete(objectifs[0], objectifs.length).then(() => { });

            for (const obj of objectifs) {
              this.objectifsService.delete(obj);
              this.deleteObjectifFromDay(obj);
            }

            this.updatingObj = false;
            this.checkWeekStats(true);
            this.deselectAll();
          }
        }
      ]
    });

    alert.present();
  }

  reportSelection(): void {
    const dateBase = this.getCurrentDay().dateObject;

    this.datePicker
      .show({
        date: dateBase,
        mode: "date",
        androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
      })
      .then(
        (date: Date) => {
          const objectifs = this.objectifs.filter(obj => obj.selected);

          if (objectifs == null || objectifs.length === 0) {
            return;
          }

          const dateStr = this.dateService.getStringFromDate(date);

          for (const obj of objectifs) {
            obj.reportCount++;
            obj.date = dateStr;
          }

          this.notificationsService.delete(objectifs[0], objectifs.length).then(() => {
            this.notificationsService.add(objectifs[0], objectifs.length);
          });

          this.objectifsService.saveChanges().then(() => {
            this.deselectAll();
            this.initDays(null, null, date);

            setTimeout(() => {
              this.checkWeekStats(true);
            }, 100);
          });

        },
        (err: any) => {
          console.error(err);
        }
      );
  }
}
