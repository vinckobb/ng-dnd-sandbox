import {Component, ChangeDetectionStrategy} from '@angular/core';
import {ComponentRoute} from '@anglr/common/router';

import {DragActiveService} from '../../../services/dragActive';
import {DndBusService} from '../../../services/dndBus';
import {DndDropEvent, DropEffect} from 'ngx-drag-drop';

export interface NestedItem
{
    id: number,
    title: string,
    children?: NestedItem[],
}

/**
 * Nested component
 */
@Component(
{
    selector: 'nested-view',
    templateUrl: 'nested.component.html',
    providers:
    [
        DragActiveService,
        DndBusService,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
@ComponentRoute({path: 'nested'})
export class NestedComponent
{
    //######################### public properties #########################

    public items: NestedItem[] = [
        {
            id: 1,
            title: 'Jednotka',
            children:
            [
                {
                    id: 2,
                    title: 'Dvojka',
                    children: []
                },
            ],
        },
        {
            id: 3,
            title: 'Trojka',
            children:
            [
                {
                    id: 4,
                    title: 'Stvorka',
                    children: []
                },
                {
                    id: 5,
                    title: 'Patka',
                    children: []
                },
                {
                    id: 6,
                    title: 'Sestka',
                    children: []
                },
            ],
        },
        {
            id: 7,
            title: 'Sedmicka',
            children: []
        },
    ];

    //######################### public methods #########################
    
    onDragged( item:any, list:any[], effect:DropEffect ) 
    {
        if( effect === 'move' ) 
        {
            const index = list.indexOf( item );
            list.splice( index, 1 );
        }
    }
    
    onDrop( event:DndDropEvent, list?:any[] ) {

        if(list && 
            (event.dropEffect === 'copy' || 
            event.dropEffect === 'move') 
        ) 
        {

            let index = event.index;

            if( typeof index === 'undefined' ) 
            {
                index = list.length;
            }

            list.splice( index, 0, event.data );
        }
        console.log(this.items);
    }
}
