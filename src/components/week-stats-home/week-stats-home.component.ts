import { Filter } from "./../../models/filter.model";
import { UtilsService } from "./../../services/utils.service";
import { Component, Input, OnInit, OnChanges, Output, EventEmitter } from "@angular/core";
import { AppConstants } from "@appPRN/app.constants";
import { Stats } from "@modelsPRN/stats.model";
import { Category } from "@modelsPRN/category.model";
import _ from "lodash";
import { Objectif } from "@modelsPRN/objectif.model";
import { ObjectifsService } from "@servicesPRN/objectifs.service";

@Component({
  selector: "stats-card",
  templateUrl: "week-stats-home.component.html"
})
export class weekStatsHomeComponent implements OnInit, OnChanges {
  @Input("stats") stats: Stats;
  @Input("weekStatsTab") weekStatsTab: boolean;
  @Input("selectionMode") selectionMode: boolean;

  @Output()
  deleteSelection = new EventEmitter<void>();

  @Output()
  reportSelection = new EventEmitter<void>();

  @Output()
  cancelSelection = new EventEmitter<void>();

  @Output()
  checkSelection = new EventEmitter<void>();

  colors: any;
  categories: Category[] = [];
  weekStatsPage: boolean = false;
  flipped: boolean = false;
  categoriesJson: any;
  importancesJson: any;
  objectifsFiltered: any = {
    category: {}
  };
  objectifs;
  objectifsDisplayed: any = {
    list: [],
    title: null,
    categoryMode: false,
    icon: null,
    color: null
  };

  constructor(
    private utilsService: UtilsService,
    private objectifsService: ObjectifsService
  ) {
    this.colors = AppConstants.colors;
  }

  ngOnChanges(): void {
    if (this.selectionMode) {
      this.flipped = true;
    } else {
      this.flipped = false;
    }
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

  reportSelect(): void {
    this.reportSelection.emit();
  }

  deleteSelect(): void {
    this.deleteSelection.emit();
  }

  checkSelect(): void {
    this.checkSelection.emit();
  }

  cancelSelect(): void {
    setTimeout(() => {
      this.cancelSelection.emit();
    }, 50);
  }

  showListObjectifs(
    type: "all" | "done" | "reportCount" | "category",
    category?: Category
  ): void {
    this.objectifsDisplayed.categoryMode = type === "category";

    if (type !== "category" && this.objectifsFiltered[type] != null) {
      this.objectifsDisplayed.list = this.objectifsService.manageDuplicates(
        this.objectifsFiltered[type],
        this.importancesJson
      );
      this.objectifsDisplayed.title = AppConstants.statsFilters[type].title;
      this.objectifsDisplayed.icon = AppConstants.statsFilters[type].icon;
      this.objectifsDisplayed.color = AppConstants.statsFilters[type].color;

      this.flipped = true;
      return;
    } else if (
      type === "category" &&
      this.objectifsFiltered[type][category.id] != null
    ) {
      this.objectifsDisplayed.list = this.objectifsService.manageDuplicates(
        this.objectifsFiltered[type][category.id],
        this.importancesJson
      );
      this.objectifsDisplayed.title = category.title;
      this.objectifsDisplayed.icon = category.icon;
      this.objectifsDisplayed.color = category.color;
      this.flipped = true;
      return;
    }

    let filter: Filter;

    switch (type) {
      case "all": {
        this.objectifsFiltered["all"] = this.stats.objectifs;
        this.objectifsDisplayed.list = this.objectifsService.manageDuplicates(
          this.objectifsFiltered["all"],
          this.importancesJson
        );
        break;
      }
      case "done": {
        filter = { criteria: "done", value: true };
        break;
      }
      case "reportCount": {
        filter = {
          criteria: "reportCount",
          value: ">=NUMBER" + AppConstants.separator + "1",
          custom: true
        };
        break;
      }
      case "category": {
        filter = { criteria: "category", value: category.id };
        break;
      }
    }

    if (type !== "category") {
      this.objectifsDisplayed.title = AppConstants.statsFilters[type].title;
      this.objectifsDisplayed.icon = AppConstants.statsFilters[type].icon;
      this.objectifsDisplayed.color = AppConstants.statsFilters[type].color;

      if (type != "all") {
        this.objectifsFiltered[type] = this.objectifsService.filterObjectifs(
          [filter],
          this.stats.objectifs
        );
      }

      this.objectifsDisplayed.list = this.objectifsService.manageDuplicates(
        this.objectifsFiltered[type],
        this.importancesJson
      );
    } else if (type === "category") {
      this.objectifsDisplayed.title = category.title;
      this.objectifsDisplayed.icon = category.icon;
      this.objectifsDisplayed.color = category.color;
      this.objectifsFiltered[type][
        category.id
      ] = this.objectifsService.filterObjectifs([filter], this.stats.objectifs);
      this.objectifsDisplayed.list = this.objectifsService.manageDuplicates(
        this.objectifsFiltered[type][category.id],
        this.importancesJson
      );
    }

    this.flipped = true;
  }

  hideListObjectifs(): void {
    this.flipped = false;
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
