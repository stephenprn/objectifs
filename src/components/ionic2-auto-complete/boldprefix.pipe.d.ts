import { PipeTransform } from '@angular/core';
/**
 * bolds the beggining of the matching string in the item
 */
export declare class BoldPrefix implements PipeTransform {
    transform(value: string, keyword: string): any;
}
