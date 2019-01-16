import { Component, EventEmitter, HostListener, Injectable, Input, NgModule, Output, Pipe, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { noop as noop$1 } from 'rxjs/util/noop';
import { Observable, Subject } from 'rxjs';
import { IonicModule } from 'ionic-angular';

// searchbar default options
var defaultOpts = {
    cancelButtonText: 'Cancel',
    showCancelButton: false,
    debounce: 250,
    placeholder: 'Search',
    autocomplete: 'off',
    autocorrect: 'off',
    spellcheck: 'off',
    type: 'search',
    value: '',
    noItems: '',
    clearOnEdit: false,
    clearInput: false
};
var AutoCompleteComponent = (function () {
    /**
     * create a new instace
     */
    function AutoCompleteComponent() {
        this.hideListOnSelection = true;
        this.onTouchedCallback = noop$1;
        this.onChangeCallback = noop$1;
        this.showListChanged = false;
        this.keyword = '';
        this.suggestions = [];
        this._showList = false;
        this.itemSelected = new EventEmitter();
        this.itemsShown = new EventEmitter();
        this.itemsHidden = new EventEmitter();
        this.ionAutoInput = new EventEmitter();
        this.autoFocus = new EventEmitter();
        this.autoBlur = new EventEmitter();
        this.options = {};
        // set default options
        this.defaultOpts = defaultOpts;
    }
    Object.defineProperty(AutoCompleteComponent.prototype, "showList", {
        /**
         * @return {?}
         */
        get: function () {
            return this._showList;
        },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            if (this._showList === value) {
                return;
            }
            this._showList = value;
            this.showListChanged = true;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * handle tap
     * @param {?} event
     * @return {?}
     */
    AutoCompleteComponent.prototype.handleTap = function (event) {
        if (this.showResultsFirst || this.keyword.length > 0) {
            this.getItems();
        }
    };
    /**
     * @param {?} value
     * @return {?}
     */
    AutoCompleteComponent.prototype.writeValue = function (value) {
        if (value !== this.selection) {
            this.selection = value || null;
            this.formValue = this.getFormValue(this.selection);
            this.keyword = this.getLabel(this.selection);
        }
    };
    /**
     * @param {?} fn
     * @return {?}
     */
    AutoCompleteComponent.prototype.registerOnChange = function (fn) {
        this.onChangeCallback = fn;
    };
    /**
     * @param {?} fn
     * @return {?}
     */
    AutoCompleteComponent.prototype.registerOnTouched = function (fn) {
        this.onTouchedCallback = fn;
    };
    /**
     * @return {?}
     */
    AutoCompleteComponent.prototype.updateModel = function () {
        this.onChangeCallback(this.formValue);
    };
    /**
     * @return {?}
     */
    AutoCompleteComponent.prototype.ngAfterViewChecked = function () {
        if (this.showListChanged) {
            this.showListChanged = false;
            this.showList ? this.itemsShown.emit() : this.itemsHidden.emit();
        }
    };
    /**
     * get items for auto-complete
     * @return {?}
     */
    AutoCompleteComponent.prototype.getItems = function () {
        var _this = this;
        var /** @type {?} */ result;
        if (this.showResultsFirst && this.keyword.trim() === '') {
            this.keyword = '';
        }
        else if (this.keyword.trim() === '') {
            this.suggestions = [];
            return;
        }
        if (typeof this.dataProvider === 'function') {
            result = this.dataProvider(this.keyword);
        }
        else {
            result = this.dataProvider.getResults(this.keyword);
        }
        // if result is instanceof Subject, use it asObservable
        if (result instanceof Subject) {
            result = result.asObservable();
        }
        if (result instanceof Promise) {
            result = Observable.fromPromise(result);
        }
        // if query is async
        if (result instanceof Observable) {
            result
                .subscribe(function (results) {
                _this.suggestions = results;
                _this.showItemList();
            }, function (error) { return console.error(error); });
        }
        else {
            this.suggestions = result;
            this.showItemList();
        }
        // emit event
        this.ionAutoInput.emit(this.keyword);
    };
    /**
     * show item list
     * @return {?}
     */
    AutoCompleteComponent.prototype.showItemList = function () {
        this.showList = true;
    };
    /**
     * hide item list
     * @return {?}
     */
    AutoCompleteComponent.prototype.hideItemList = function () {
        this.showList = this.alwaysShowList;
    };
    /**
     * select item from list
     *
     * @param {?} selection
     *
     * @return {?}
     */
    AutoCompleteComponent.prototype.select = function (selection) {
        this.keyword = this.getLabel(selection);
        this.formValue = this.getFormValue(selection);
        this.hideItemList();
        // emit selection event
        this.updateModel();
        if (this.hideListOnSelection) {
            this.hideItemList();
        }
        // emit selection event
        this.itemSelected.emit(selection);
        this.selection = selection;
    };
    /**
     * get current selection
     * @return {?}
     */
    AutoCompleteComponent.prototype.getSelection = function () {
        return this.selection;
    };
    /**
     * get current input value
     * @return {?}
     */
    AutoCompleteComponent.prototype.getValue = function () {
        return this.formValue;
    };
    /**
     * set current input value
     * @param {?} selection
     * @return {?}
     */
    AutoCompleteComponent.prototype.setValue = function (selection) {
        this.formValue = this.getFormValue(selection);
        this.keyword = this.getLabel(selection);
        return;
    };
    /**
     * /**
     * clear current input value
     * @param {?=} hideItemList
     * @return {?}
     */
    AutoCompleteComponent.prototype.clearValue = function (hideItemList) {
        if (hideItemList === void 0) { hideItemList = false; }
        this.keyword = '';
        this.selection = null;
        this.formValue = null;
        if (hideItemList) {
            this.hideItemList();
        }
        return;
    };
    /**
     * set focus of searchbar
     * @return {?}
     */
    AutoCompleteComponent.prototype.setFocus = function () {
        if (this.searchbarElem) {
            this.searchbarElem.setFocus();
        }
    };
    /**
     * fired when the input focused
     * @return {?}
     */
    AutoCompleteComponent.prototype.onFocus = function () {
        this.autoFocus.emit();
    };
    /**
     * fired when the input focused
     * @return {?}
     */
    AutoCompleteComponent.prototype.onBlur = function () {
        this.autoBlur.emit();
    };
    /**
     * handle document click
     * @param {?} event
     * @return {?}
     */
    AutoCompleteComponent.prototype.documentClickHandler = function (event) {
        if ((this.searchbarElem
            && !this.searchbarElem._elementRef.nativeElement.contains(event.target))
            ||
                (!this.inputElem && this.inputElem._elementRef.nativeElement.contains(event.target))) {
            this.hideItemList();
        }
    };
    /**
     * @param {?} selection
     * @return {?}
     */
    AutoCompleteComponent.prototype.getFormValue = function (selection) {
        if (selection == null) {
            return null;
        }
        var /** @type {?} */ attr = this.dataProvider.formValueAttribute == null ? this.dataProvider.labelAttribute : this.dataProvider.formValueAttribute;
        if (typeof selection === 'object' && attr) {
            return selection[attr];
        }
        return selection;
    };
    /**
     * @param {?} selection
     * @return {?}
     */
    AutoCompleteComponent.prototype.getLabel = function (selection) {
        if (selection == null) {
            return '';
        }
        var /** @type {?} */ attr = this.dataProvider.labelAttribute;
        var /** @type {?} */ value = selection;
        if (this.dataProvider.getItemLabel) {
            value = this.dataProvider.getItemLabel(value);
        }
        if (typeof value === 'object' && attr) {
            return value[attr] || '';
        }
        return value || '';
    };
    return AutoCompleteComponent;
}());
AutoCompleteComponent.decorators = [
    { type: Component, args: [{
                selector: 'ion-auto-complete',
                template: "\n        <ion-input\n                #inputElem\n                (keyup)=\"getItems($event)\"\n                (tap)=\"handleTap($event)\"\n                [(ngModel)]=\"keyword\"\n                (ngModelChange)=\"updateModel()\"\n                [placeholder]=\"options.placeholder == null ? defaultOpts.placeholder : options.placeholder\"\n                [type]=\"options.type == null ? defaultOpts.type : options.type\"\n                [clearOnEdit]=\"options.clearOnEdit == null ? defaultOpts.clearOnEdit : options.clearOnEdit\"\n                [clearInput]=\"options.clearInput == null ? defaultOpts.clearInput : options.clearInput\"\n                [disabled]=\"disabled\"\n                [ngClass]=\"{'hidden': !useIonInput}\"\n                (ionFocus)=\"onFocus()\"\n                (ionBlur)=\"onBlur()\"\n        >\n        </ion-input>\n        <ion-searchbar\n                #searchbarElem\n                (ionInput)=\"getItems($event)\"\n                (tap)=\"handleTap($event)\"\n                [(ngModel)]=\"keyword\"\n                (ngModelChange)=\"updateModel()\"\n                [cancelButtonText]=\"options.cancelButtonText == null ? defaultOpts.cancelButtonText : options.cancelButtonText\"\n                [showCancelButton]=\"options.showCancelButton == null ? defaultOpts.showCancelButton : options.showCancelButton\"\n                [debounce]=\"options.debounce == null ? defaultOpts.debounce : options.debounce\"\n                [placeholder]=\"options.placeholder == null ? defaultOpts.placeholder : options.placeholder\"\n                [autocomplete]=\"options.autocomplete == null ? defaultOpts.autocomplete : options.autocomplete\"\n                [autocorrect]=\"options.autocorrect == null ? defaultOpts.autocorrect : options.autocorrect\"\n                [spellcheck]=\"options.spellcheck == null ? defaultOpts.spellcheck : options.spellcheck\"\n                [type]=\"options.type == null ? defaultOpts.type : options.type\"\n                [disabled]=\"disabled\"\n                [ngClass]=\"{'hidden': useIonInput}\"\n                (ionClear)=\"clearValue(true)\"\n                (ionFocus)=\"onFocus()\"\n                (ionBlur)=\"onBlur()\"\n        >\n        </ion-searchbar>\n        <ng-template #defaultTemplate let-attrs=\"attrs\">\n            <span [innerHTML]='attrs.label | boldprefix:attrs.keyword'></span>\n        </ng-template>\n        <ul *ngIf=\"!disabled && suggestions.length > 0 && showList\">\n            <li *ngFor=\"let suggestion of suggestions\" (tap)=\"select(suggestion);$event.srcEvent.stopPropagation()\">\n                <ng-template\n                        [ngTemplateOutlet]=\"template || defaultTemplate\"\n                        [ngTemplateOutletContext]=\"\n                        {attrs:{ \n                          data: suggestion, \n                          label: getLabel(suggestion),\n                          keyword: keyword,\n                          formValue: getFormValue(suggestion), \n                          labelAttribute: dataProvider.labelAttribute, \n                          formValueAttribute: dataProvider.formValueAttribute }}\"></ng-template>\n            </li>\n        </ul>\n        <p *ngIf=\"suggestions.length == 0 && showList && options.noItems\">{{ options.noItems }}</p>\n    ",
                providers: [
                    { provide: NG_VALUE_ACCESSOR, useExisting: AutoCompleteComponent, multi: true }
                ]
            },] },
];
/**
 * @nocollapse
 */
AutoCompleteComponent.ctorParameters = function () { return []; };
AutoCompleteComponent.propDecorators = {
    'dataProvider': [{ type: Input },],
    'options': [{ type: Input },],
    'disabled': [{ type: Input },],
    'keyword': [{ type: Input },],
    'showResultsFirst': [{ type: Input },],
    'alwaysShowList': [{ type: Input },],
    'hideListOnSelection': [{ type: Input },],
    'template': [{ type: Input },],
    'useIonInput': [{ type: Input },],
    'autoFocus': [{ type: Output },],
    'autoBlur': [{ type: Output },],
    'itemSelected': [{ type: Output },],
    'itemsShown': [{ type: Output },],
    'itemsHidden': [{ type: Output },],
    'ionAutoInput': [{ type: Output },],
    'searchbarElem': [{ type: ViewChild, args: ['searchbarElem',] },],
    'inputElem': [{ type: ViewChild, args: ['inputElem',] },],
    'documentClickHandler': [{ type: HostListener, args: ['document:click', ['$event'],] },],
};

/**
 * bolds the beggining of the matching string in the item
 */
var BoldPrefix = (function () {
    function BoldPrefix() {
    }
    /**
     * @param {?} value
     * @param {?} keyword
     * @return {?}
     */
    BoldPrefix.prototype.transform = function (value, keyword) {
        if (!keyword)
            return value;
        var /** @type {?} */ escaped_keyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return value.replace(new RegExp(escaped_keyword, 'gi'), function (str) { return str.bold(); });
    };
    return BoldPrefix;
}());
BoldPrefix.decorators = [
    { type: Pipe, args: [{
                name: 'boldprefix'
            },] },
    { type: Injectable },
];
/**
 * @nocollapse
 */
BoldPrefix.ctorParameters = function () { return []; };

var AutoCompleteModule = (function () {
    function AutoCompleteModule() {
    }
    /**
     * @return {?}
     */
    AutoCompleteModule.forRoot = function () {
        return {
            ngModule: AutoCompleteModule,
            providers: []
        };
    };
    return AutoCompleteModule;
}());
AutoCompleteModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule,
                    FormsModule,
                    IonicModule
                ],
                declarations: [
                    AutoCompleteComponent,
                    BoldPrefix
                ],
                exports: [
                    AutoCompleteComponent,
                    BoldPrefix
                ]
            },] },
];
/**
 * @nocollapse
 */
AutoCompleteModule.ctorParameters = function () { return []; };

export { AutoCompleteModule, AutoCompleteComponent, BoldPrefix };
