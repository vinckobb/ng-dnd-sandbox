import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NestedItem} from '../nested.component';

@Component(
{
    selector: 'nested-item',
    templateUrl: 'item.component.html',
    standalone: true,
    imports:
    [
        CommonModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NestedItemSAComponent
{
    //######################### public properties - inputs and outputs #########################

    /**
     * Item data
     */
    @Input()
    public data: NestedItem;
}