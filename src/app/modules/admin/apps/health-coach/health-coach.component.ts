import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector       : 'health-coach',
    templateUrl    : './health-coach.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HealthCoachComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
