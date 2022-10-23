import {Component, ChangeDetectionStrategy} from '@angular/core';
import {ComponentRoute} from '@anglr/common/router';

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
                },
                {
                    id: 5,
                    title: 'Patka',
                },
                {
                    id: 6,
                    title: 'Sestka',
                },
            ],
        },
        {
            id: 7,
            title: 'Sedmicka',
        },
    ];
}
