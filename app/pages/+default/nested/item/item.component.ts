import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DndModule} from '@ng-dnd/core';

import {NestedItem} from '../nested.component';
import {NestedDndCoreModule} from '../modules';

@Component(
{
    selector: 'nested-item',
    templateUrl: 'item.component.html',
    standalone: true,
    imports:
    [
        CommonModule,
        DndModule,
        NestedDndCoreModule,
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

    @Input()
    public parent?: NestedItem;

    @Input()
    public index: number;

    //######################### public methods #########################

    public moved(event: any)
    {
        console.log('moved', event);
    }
}