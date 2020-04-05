import { UtilsService } from "@servicesPRN/utils.service";
import { ObjectifsLaterService } from "./../../services/objectifs-later.service";
import { Component, Input, OnInit } from "@angular/core";
import {
  ViewController,
  ActionSheetButton,
  AlertButton,
  Alert,
  AlertController,
  ActionSheet,
  ActionSheetController
} from "ionic-angular";
import { AppConstants } from "@appPRN/app.constants";
import _ from "lodash";

@Component({
  selector: "page-drafts",
  templateUrl: "drafts.page.html"
})
export class DraftsPage implements OnInit {
  @Input()
  categoriesJson: any;

  drafts: any[];
  limitDescription: number;
  pressed: boolean = false;
  selectMode: boolean = false;

  constructor(
    private viewCtrl: ViewController,
    private objectifsLaterService: ObjectifsLaterService,
    private utilsService: UtilsService,
    private alertCtrl: AlertController,
    public actionSheetCtrl: ActionSheetController
  ) {
    this.limitDescription = AppConstants.limitDescription;
    this.categoriesJson = this.utilsService.getObjectFromArray(
      "id",
      ["title", "icon", "color"],
      AppConstants.categories
    );
  }

  ngOnInit(): void {
    this.drafts = _.cloneDeep(this.objectifsLaterService.getAll()).reverse();
    console.log(this.drafts);
  }

  dismissModal(draft?: any): void {
    this.viewCtrl.dismiss(draft);
  }

  showDelete(draft: any): void {
    let buttons: AlertButton[] = [
      {
        text: "Supprimer",
        cssClass: "redText",
        handler: () => {
          this.objectifsLaterService.remove(draft.id);
          for (let i = 0; i < this.drafts.length; i++) {
            if (this.drafts[i].id === draft.id) {
              this.drafts.splice(i, 1);
              break;
            }
          }
        }
      },
      {
        text: "Annuler",
        role: "destructive"
      }
    ];

    let alert: Alert = this.alertCtrl.create({
      title: "Supprimer un brouillon",
      subTitle: "Ce brouillon sera définitivement supprimé.",
      enableBackdropDismiss: true,
      buttons: buttons
    });

    alert.present();
  }

  displayConfirmationDelete(): void {
    let alert: Alert = this.alertCtrl.create({
      title: "Supprimer la sélection ?",
      subTitle: "Les brouillons sélectionnés seront supprimés définitivement.",
      enableBackdropDismiss: true,
      buttons: [
        {
          text: "Annuler",
          role: "destructive"
        },
        {
          text: "Supprimer",
          cssClass: "redText",
          handler: () => {
            this.deleteSelection();
          }
        }
      ]
    });

    alert.present();
  }

  deleteSelection(): void {
    const idsToDelete = this.drafts.filter(d => d.selected).map(d => d.id);
    this.objectifsLaterService.remove(idsToDelete);
    this.drafts = this.objectifsLaterService.getAll();
    this.selectMode = false;
  }

  showActions(draft: any): void {
    // Buttons that are displayed in the action sheet
    let buttons: ActionSheetButton[] = [
      {
        text: "Editer",
        handler: () => {
          this.dismissModal(draft);
        }
      },
      {
        text: "Supprimer",
        cssClass: "redText",
        handler: () => {
          this.showDelete(draft);
          return true;
        }
      },
      {
        text: "Annuler",
        role: "cancel"
      }
    ];

    const actionSheet: ActionSheet = this.actionSheetCtrl.create({
      title:
        draft.title != null && draft.title != ""
          ? draft.title
          : "Brouillon sans titre",
      buttons: buttons
    });

    actionSheet.present();
  }

  draftClicked(draft: any): void {
    if (this.pressed) {
      this.pressed = false;
      return;
    }

    if (this.selectMode) {
      draft.selected = !draft.selected;

      if (!this.drafts.some(dr => dr.selected)) {
        this.selectMode = false;
      }
    } else {
      this.showActions(draft);
    }
  }

  select(draft: any): void {
    console.log(draft);
    if (this.selectMode) {
      draft.selected = !draft.selected;

      if (!this.drafts.some(obj => obj.selected)) {
        this.selectMode = false;
      }
    } else {
      this.selectMode = true;
      draft.selected = true;
      this.pressed = true;
    }
  }
}
