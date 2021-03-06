import { Component, ViewChild, OnInit } from "@angular/core";
import { SettingsService } from "@servicesPRN/settings.service";
import { UiService } from "@servicesPRN/ui.service";
import { NavController } from "ionic-angular";
import { ObjectifsPage } from "@pagesPRN/objectifs/objectifs.page";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";

@Component({
  selector: "page-password",
  templateUrl: "password.page.html",
})
export class PasswordPage implements OnInit {
  formGroup: FormGroup;
  @ViewChild("input") input;
  isFocus: boolean = false;
  shouldHeight = document.body.clientHeight + "px";

  // for ux purpose
  locked = true;

  constructor(
    private settingsService: SettingsService,
    private uiService: UiService,
    private navController: NavController,
    formBuilder: FormBuilder
  ) {
    this.formGroup = formBuilder.group({
      password: ["", [Validators.required]],
    });
  }

  ngOnInit(): void {
    let height = window.innerHeight;

    let form = window.document.getElementById("form");
    form.style.marginTop = String(height * 0.4) + "px";
  }

  ngAfterViewChecked() {
    if (!this.isFocus) {
      setTimeout(() => {
        this.input.setFocus();
        this.isFocus = true;
      }, 500);
    }
  }

  submit() {
    if (
      this.settingsService.checkPassword(this.formGroup.get("password").value)
    ) {
      this.locked = false;

      setTimeout(() => {
        this.navController.setRoot(
          ObjectifsPage,
          {},
          { animate: true, direction: "forward" }
        );
      }, 300);
    } else {
      this.uiService.displayToast("Mot de passe incorrect");
    }
  }
}
