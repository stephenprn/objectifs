import { Component, OnInit, EventEmitter, Output, Input } from "@angular/core";
import { SuggestionsService } from "@servicesPRN/suggestions.service";
import { UiService } from "@servicesPRN/ui.service";

@Component({
  selector: "app-autocomplete",
  templateUrl: "./autocomplete.component.html",
  // styleUrls: ['./autocomplete.component.scss']
})
export class AutocompleteComponent implements OnInit {
  @Input() text: string;
  @Output() textChange = new EventEmitter<string>();

  @Output()
  showDrafts = new EventEmitter<void>();

  draftsButtonShowed: boolean;

  suggestions: string[] = [];

  constructor(
    private suggestionsService: SuggestionsService,
    private uiService: UiService
  ) {}

  ngOnInit() {
    this.draftsButtonShowed = this.suggestionsService.suggestions.length > 0;
  }

  draftClicked() {
    this.showDrafts.emit();
  }

  textChanged() {
    if (this.text == null || this.text === "") {
      this.suggestions = [];
      return;
    }

    this.textChange.emit(this.text);
    this.suggestions = this.suggestionsService.getResults(this.text);
  }

  select(sug: string) {
    this.text = sug;
    this.suggestions = [];
  }

  deleteSuggestion(sug: string) {
    this.suggestionsService.deleteSuggestion(sug);
    this.uiService.displayToastDeleteSug(sug);
  }

  blured() {
    // this.suggestions = [];
  }
}
