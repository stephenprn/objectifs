import { EventEmitter, TemplateRef } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
export declare class AutoCompleteComponent implements ControlValueAccessor {
    dataProvider: any;
    options: any;
    disabled: any;
    keyword: string;
    showResultsFirst: boolean;
    alwaysShowList: boolean;
    hideListOnSelection: boolean;
    template: TemplateRef<any>;
    useIonInput: boolean;
    autoFocus: EventEmitter<any>;
    autoBlur: EventEmitter<any>;
    itemSelected: EventEmitter<any>;
    itemsShown: EventEmitter<any>;
    itemsHidden: EventEmitter<any>;
    ionAutoInput: EventEmitter<string>;
    searchbarElem: any;
    inputElem: any;
    private onTouchedCallback;
    private onChangeCallback;
    suggestions: any[];
    formValue: any;
    showList: boolean;
    private _showList;
    private defaultOpts;
    private selection;
    private showListChanged;
    /**
     * create a new instace
     */
    constructor();
    /**
     * handle tap
     * @param event
     */
    private handleTap(event);
    writeValue(value: any): void;
    registerOnChange(fn: any): void;
    registerOnTouched(fn: any): void;
    updateModel(): void;
    ngAfterViewChecked(): void;
    /**
     * get items for auto-complete
     */
    getItems(): void;
    /**
     * show item list
     */
    showItemList(): void;
    /**
     * hide item list
     */
    hideItemList(): void;
    /**
     * select item from list
     *
     * @param event
     * @param selection
     **/
    select(selection: any): void;
    /**
     * get current selection
     * @returns {any}
     */
    getSelection(): any;
    /**
     * get current input value
     * @returns {string}
     */
    getValue(): any;
    /**
     * set current input value
     */
    setValue(selection: any): void;
    /**

     /**
     * clear current input value
     */
    clearValue(hideItemList?: boolean): void;
    /**
     * set focus of searchbar
     */
    setFocus(): void;
    /**
     * fired when the input focused
     */
    onFocus(): void;
    /**
     * fired when the input focused
     */
    onBlur(): void;
    /**
     * handle document click
     * @param event
     */
    private documentClickHandler(event);
    private getFormValue(selection);
    private getLabel(selection);
}
