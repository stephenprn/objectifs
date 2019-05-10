import { UtilsService } from "./utils.service";
import { Injectable } from "@angular/core";
import { Objectif } from "@modelsPRN/objectif.model";
import { Stats } from "@modelsPRN/stats.model";
import { ObjectifsService } from "@servicesPRN/objectifs.service";
import { AppConstants } from "@appPRN/app.constants";

@Injectable()
export class StatsService {
  importancesJson: any;

  constructor(
    private objectifsService: ObjectifsService,
    private utilsService: UtilsService
  ) {
    this.importancesJson = this.utilsService.getObjectFromArray(
      "id",
      ["icon", "color", "index", "title"],
      AppConstants.importances
    );
  }

  public getNumberDone(objectifs?: Objectif[]): number {
    if (!objectifs) {
      objectifs = this.objectifsService.getAll();
    }

    let countDone: number = 0;

    objectifs.forEach((obj: Objectif) => {
      if (obj.done) countDone++;
    });

    return countDone;
  }

  public getStats(
    objectifs?: Objectif[],
    categoriesUsage?: boolean,
    getObjectifs?: boolean
  ): Stats {
    if (objectifs == null) {
      objectifs = this.objectifsService.getAll();
    }

    let stats: Stats = new Stats();

    if (categoriesUsage) {
      stats.categoriesUsage = {};
    }

    stats.total = objectifs.length;

    objectifs.forEach((obj: Objectif) => {
      if (obj.done) {
        stats.done++;
      }

      if (obj.reportCount > 0) {
        stats.reports += obj.reportCount;
        stats.reported++;
      }

      if (categoriesUsage) {
        if (stats.categoriesUsage.hasOwnProperty(obj.category)) {
          stats.categoriesUsage[obj.category].total++;

          if (obj.done) {
            stats.categoriesUsage[obj.category].done++;
          }
        } else {
          stats.categoriesUsage[obj.category] = { done: 0, total: 1 };

          if (obj.done) {
            stats.categoriesUsage[obj.category].done = 1;
          }
        }
      }
    });

    if (getObjectifs) {
      stats.objectifs = objectifs;
      this.objectifsService.orderObjectives(
        stats.objectifs,
        this.importancesJson
      );
    }

    return stats;
  }
}
