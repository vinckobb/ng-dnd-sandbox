import {Component, ChangeDetectionStrategy} from '@angular/core';
import {ComponentRoute} from '@anglr/common/router';

/**
 * Nested component
 */
@Component(
{
    selector: 'nested-view',
    templateUrl: 'nested.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
@ComponentRoute({path: 'nested'})
export class NestedComponent
{
}
