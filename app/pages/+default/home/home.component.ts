import {Component, ChangeDetectionStrategy} from '@angular/core';
import {ComponentRoute, ComponentRedirectRoute} from '@anglr/common/router';

/**
 * Home component
 */
@Component(
{
    selector: 'home-view',
    templateUrl: 'home.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
@ComponentRedirectRoute('', 'home')
@ComponentRoute({path: 'home'})
export class HomeComponent
{
}
