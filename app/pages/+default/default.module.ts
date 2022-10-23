import {NgModule} from '@angular/core';
import {ModuleRoutes} from '@anglr/common/router';
import {DndModule} from 'ngx-drag-drop';

import {components} from './default.routes';
import {DebuggingFeatureModule, DisplayingFeatureModule, FormsFeatureModule} from '../../modules';
import {NestedItemSAComponent} from './nested/item/item.component';

/**
 * Module for Default application pages
 */
@NgModule(
{
    imports:
    [
        DisplayingFeatureModule,
        FormsFeatureModule,
        DebuggingFeatureModule,
        NestedItemSAComponent,
        DndModule,
    ],
    declarations:
    [
        ...components
    ]
})
@ModuleRoutes(components)
export class DefaultModule
{
}