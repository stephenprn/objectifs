import { UtilsService } from "./../../services/utils.service";
import { Component, Input, OnInit } from "@angular/core";
import { AppConstants } from "@appPRN/app.constants";
import { Stats } from "@modelsPRN/stats.model";
import { Category } from "@modelsPRN/category.model";
import _ from "lodash";
import { Objectif } from "@modelsPRN/objectif.model";

@Component({
  selector: "stats-card",
  templateUrl: "week-stats-home.component.html"
})
export class weekStatsHomeComponent implements OnInit {
  @Input("stats") stats: Stats;

  @Input()
  objectifs: Objectif[];

  colors: any;
  categories: Category[] = [];
  weekStatsPage: boolean = false;
  flipped: boolean = false;
  categoriesJson: any;
  importancesJson: any;

  constructor(private utilsService: UtilsService) {
    this.colors = AppConstants.colors;
  }

  ngOnInit(): void {
    this.constructCategories();

    if (this.stats != null && this.stats.objectifs != null) {
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
    }
  }

  showListObjectifs(): void {
    this.flipped = !this.flipped;
  }

  private constructCategories() {
    if (this.stats == null || this.stats.categoriesUsage == null) {
      return;
    } else {
      this.weekStatsPage = true;
    }

    AppConstants.categories.forEach((category: Category) => {
      if (this.stats.categoriesUsage[category.id] != null) {
        let cat: Category = _.cloneDeep(category);
        cat.number = this.stats.categoriesUsage[category.id];
        this.categories.push(cat);
      }
    });

    this.sortCategories();
  }

  private sortCategories() {
    this.categories.sort((a: Category, b: Category) => {
      if (a.number.total > b.number.total) {
        return -1;
      } else if (a.number.total < b.number.total) {
        return 1;
      } else if (a.title > b.title) {
        return 1;
      } else {
        return -1;
      }
    });
  }
}
