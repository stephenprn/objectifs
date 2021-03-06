import { Injectable } from "@angular/core";
import { AppConstants } from "@appPRN/app.constants";
import { Storage } from "@ionic/storage";
import { Filter } from "@modelsPRN/filter.model";
import { Objectif } from "@modelsPRN/objectif.model";
import { DateService } from "@servicesPRN/date.service";
import { NotificationsService } from "@servicesPRN/notifications.service";
import { SuggestionsService } from "@servicesPRN/suggestions.service";
import { UiService } from "@servicesPRN/ui.service";
import _ from "lodash";

@Injectable()
export class ObjectifsService {
  objectifs: Objectif[];
  objectifsLater: any[];
  objectifsPeriodic: Objectif[];
  id: number;
  idPeriodic: number;
  colors = AppConstants.progressBarColors;

  constructor(
    private suggestionsService: SuggestionsService,
    private dateService: DateService,
    private uiService: UiService,
    private notificationsService: NotificationsService,
    private storage: Storage
  ) { }

  public getAll(periodic?: boolean): Objectif[] {
    if (periodic) {
      return this.objectifsPeriodic;
    } else {
      return this.objectifs;
    }
  }

  public loadStoredId(periodic?: boolean): Promise<void> {
    return new Promise((resolve, reject) => {
      let nameStorage: string;

      if (!periodic) {
        nameStorage = AppConstants.storageNames.id.base;
      } else {
        nameStorage = AppConstants.storageNames.id.periodic;
      }

      this.storage.get(nameStorage).then((id: number) => {
        if (!id) {
          id = 1;
          this.storage.set(nameStorage, id);
        }

        if (periodic) {
          this.idPeriodic = id;
        } else {
          this.id = id;
        }

        resolve();
      });
    });
  }

  private getId(periodic?: boolean): number {
    if (periodic) {
      this.idPeriodic++;
      this.storage.set(AppConstants.storageNames.id.periodic, this.idPeriodic);
      return this.idPeriodic;
    } else {
      this.id++;
      this.storage.set(AppConstants.storageNames.id.base, this.id);
      return this.id;
    }
  }

  public add(objectif: Objectif): void {
    if (objectif.periodicity === "punctual") {
      objectif.id = this.getId();

      delete objectif.periodicity;

      this.objectifs.push(objectif);
      this.suggestionsService.save(objectif.title);
      this.suggestionsService.incrementeCategory(objectif.category);

      this.notificationsService.add(objectif);
      this.saveChanges();
    } else {
      objectif.id = this.getId(true);

      this.objectifsPeriodic.push(objectif);
      this.suggestionsService.save(objectif.title);
      this.suggestionsService.incrementeCategory(objectif.category);

      this.saveChanges(true);

      objectif.idPeriodic = objectif.id;
      this.generateObjectifsPeriodic(objectif);

      this.saveChanges();
    }
  }

  public update(objectif: Objectif): void {
    let oldObjectif = null;

    for (let i = 0; i < this.objectifs.length; i++) {
      if (this.objectifs[i].id === objectif.id) {
        oldObjectif = _.cloneDeep(this.objectifs[i]);
        this.objectifs[i] = _.cloneDeep(objectif);
        break;
      }
    }

    if (oldObjectif == null) {
      this.uiService.displayToast(
        "Erreur lors de la modification de cet objectif, veuillez relancer l'application"
      );
      return;
    }

    this.notificationsService.delete(oldObjectif).then(() => {
      this.notificationsService.add(objectif);
    });

    this.saveChanges();
  }

  public delete(objectif: Objectif): void {
    for (let i = 0; i < this.objectifs.length; i++) {
      if (this.objectifs[i].id === objectif.id) {
        this.objectifs.splice(i, 1);
        break;
      }
    }

    this.saveChanges();
  }

  private generateObjectifsPeriodic(objectifPeriodic: Objectif): void {
    let date: Date = this.dateService.getDateFromString(objectifPeriodic.date);
    let endDate: Date;
    let nbr: number;

    // Normally dateEndPeriodicity is never null but we never know...
    if (objectifPeriodic.dateEndPeriodicity != null) {
      endDate = this.dateService.getDateFromString(
        objectifPeriodic.dateEndPeriodicity
      );
    } else {
      endDate = _.cloneDeep(date);
      endDate.setMonth(endDate.getMonth() + 1);
    }

    if (objectifPeriodic.periodicityCustomNumber != null) {
      nbr = objectifPeriodic.periodicityCustomNumber;
    } else {
      nbr = 1;
    }

    // If we don't do this, the while miss one objectif at the end
    endDate.setDate(endDate.getDate() + 1);

    switch (objectifPeriodic.periodicity) {
      case "daily":
        while (date < endDate) {
          this.formatObjectifPeriodic(objectifPeriodic, date);
          date.setDate(date.getDate() + nbr);
        }
        break;
      case "weekly":
        while (date < endDate) {
          this.formatObjectifPeriodic(objectifPeriodic, date);
          date.setDate(date.getDate() + 7 * nbr);
        }
        break;
      case "monthly":
        while (date < endDate) {
          this.formatObjectifPeriodic(objectifPeriodic, date);
          date.setMonth(date.getMonth() + nbr);
        }
        break;
      case "customDays":
        const beginDate: Date = _.cloneDeep(date);

        while (date < endDate) {
          objectifPeriodic.periodicityCustomDays.forEach((dayNbr: number) => {
            const currentDay = date.getDay();
            date.setDate(date.getDate() + dayNbr - currentDay);
            if (date >= beginDate && date <= endDate) {
              this.formatObjectifPeriodic(objectifPeriodic, date);
            }
          });

          date = this.nextWeekdayDate(date, 1);
        }
        break;
    }
  }

  private formatObjectifPeriodic(objectifPeriodic: Objectif, date: Date): void {
    let objectif: Objectif = _.cloneDeep(objectifPeriodic);

    objectif.date = this.dateService.getStringFromDate(date);
    objectif.periodicity = "punctual";
    delete objectif.dateEndPeriodicity;

    this.add(objectif);
  }

  private nextWeekdayDate(date, day_in_week): Date {
    // day_in_week: 1 (monday) - 7 (sunday)
    let ret: Date = new Date(date || new Date());
    ret.setDate(ret.getDate() + ((day_in_week - 1 - ret.getDay() + 7) % 7) + 1);
    return ret;
  }

  public saveChanges(periodic?: boolean): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!periodic) {
        this.storage
          .set(AppConstants.storageNames.objectif.base, this.objectifs)
          .then(() => {
            resolve();
          });
      } else {
        this.storage
          .set(
            AppConstants.storageNames.objectif.periodic,
            this.objectifsPeriodic
          )
          .then(() => {
            resolve();
          });
      }
    });
  }

  public loadStored(periodic?: boolean): Promise<Objectif[]> {
    return new Promise((resolve, reject) => {
      let array: Objectif[];
      let nameStorage: string;

      if (!periodic) {
        nameStorage = AppConstants.storageNames.objectif.base;
        array = this.objectifs;
      } else {
        nameStorage = AppConstants.storageNames.objectif.periodic;
        array = this.objectifsPeriodic;
      }

      if (array != null) {
        resolve(array);
        return;
      }

      this.storage.get(nameStorage).then((objectifs: Objectif[]) => {
        if (!objectifs) {
          array = [];
        } else {
          array = objectifs;
        }

        if (!periodic) {
          this.objectifs = array;
        } else {
          this.objectifsPeriodic = array;
        }

        resolve(array);
      });
    });
  }

  // TODO : delete this function
  public getNbrObjectifs(objectifs?: Objectif[]): number {
    if (!objectifs) {
      objectifs = this.objectifs;
    }

    return objectifs.length;
  }

  // Filter objectifs : return the list or the length of the list if filter.count
  public filterObjectifs(
    filters: Filter[],
    objectifs?: Objectif[],
    count?: boolean,
    noClone?: boolean
  ): any {
    if (!objectifs) {
      objectifs = this.objectifs;
    }

    if (!noClone) {
      objectifs = _.cloneWith(objectifs);
    }

    filters.forEach((filter: Filter) => {
      let filterFunction;
      let dateFilter: Date;
      let numberValue: number;

      if (filter.custom) {
        const type: string = filter.value.substr(
          0,
          filter.value.indexOf(AppConstants.separator)
        );

        switch (type) {
          case ">=DATE":
            dateFilter = this.getDateFilter(filter);
            filterFunction = (obj: Objectif) => {
              if (this.dateService.getDateFromString(obj.date) >= dateFilter) {
                return obj;
              }
            };
            break;
          case "<=DATE":
            dateFilter = this.getDateFilter(filter);
            filterFunction = (obj: Objectif) => {
              if (this.dateService.getDateFromString(obj.date) <= dateFilter) {
                return obj;
              }
            };
            break;
          case ">=NUMBER":
            numberValue = Number(
              filter.value.substr(
                filter.value.indexOf(AppConstants.separator) +
                AppConstants.separator.length,
                filter.value.length - 1
              )
            );

            filterFunction = (obj: Objectif) => {
              if (obj[filter.criteria] >= numberValue) {
                return obj;
              }
            };
            break;
          case "<=NUMBER":
            numberValue = Number(
              filter.value.substr(
                filter.value.indexOf(AppConstants.separator) +
                AppConstants.separator.length,
                filter.value.length - 1
              )
            );

            filterFunction = (obj: Objectif) => {
              if (obj[filter.criteria] <= numberValue) {
                return obj;
              }
            };
            break;
        }
      } else {
        filterFunction = (obj: Objectif) => {
          if (obj[filter.criteria] === filter.value) {
            return obj;
          }
        };
      }
      objectifs = objectifs.filter(filterFunction);
    });

    return count ? objectifs.length : objectifs;
  }

  private getDateFilter(filter: Filter): Date {
    return this.dateService.getDateFromString(
      filter.value.substr(
        filter.value.indexOf(AppConstants.separator) +
        AppConstants.separator.length,
        filter.value.length - 1
      )
    );
  }

  // Sort objectives by not done first and name
  public orderObjectives(objs: Objectif[], importancesJson): void {
    objs.sort((a: Objectif, b: Objectif) => {
      if (a.done && !b.done) {
        return 1;
      } else if (!a.done && b.done) {
        return -1;
      } else {
        if (
          importancesJson[a.importance].index >
          importancesJson[b.importance].index
        ) {
          return -1;
        } else if (
          importancesJson[a.importance].index <
          importancesJson[b.importance].index
        ) {
          return 1;
        } else {
          return a.title.localeCompare(b.title, 'fr', { 'sensitivity': 'base' });
        }
      }
    });
  }

  public manageDuplicates(objectifs: Objectif[], importancesJson: any): Objectif[] {
    let objectifsCopy = _.cloneDeep(objectifs);
    let counts: any = {};

    for (let i = objectifsCopy.length - 1; i >= 0; i--) {
      const obj = objectifsCopy[i];

      if (counts[obj.title] != null) {
        counts[obj.title].count++;

        if (obj.done) {
          counts[obj.title].done++;
        }

        objectifsCopy.splice(i, 1);
      } else {
        counts[obj.title] = {};
        counts[obj.title].count = 1;

        if (obj.done) {
          counts[obj.title].done = 1;
        } else {
          counts[obj.title].done = 0;
        }
      }
    }

    objectifsCopy.forEach((obj: Objectif) => {
      obj.count = counts[obj.title].count;
      obj.countDone = counts[obj.title].done;

      if (obj.count > 1) {
        if (obj.count != obj.countDone) {
          obj.done = false;
        }

        const progress = (obj.countDone / obj.count) * 100;

        for (let i = 0; i < this.colors.length; i++) {
          if (progress <= this.colors[i].value) {
            obj.countColor = this.colors[i].color;
            break;
          }
        }
      }
    });

    this.orderObjectives(objectifsCopy, importancesJson);

    return objectifsCopy;
  }
}
