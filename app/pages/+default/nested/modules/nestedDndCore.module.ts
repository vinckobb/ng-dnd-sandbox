import {NgModule} from '@angular/core';

import {DndCoreNestedItemDirective} from '../directives/dndCoreNestedItem/dndCoreNestedItem.directive';

/**
 * Module used for handling nested dnd core stuff
 */
@NgModule(
{
    declarations:
    [
        DndCoreNestedItemDirective,
    ],
    exports:
    [
        DndCoreNestedItemDirective,
    ],
})
export class NestedDndCoreModule
{
}