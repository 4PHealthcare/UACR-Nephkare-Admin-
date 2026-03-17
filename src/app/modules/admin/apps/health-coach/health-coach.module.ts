import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HealthCoachComponent } from 'app/modules/admin/apps/health-coach/health-coach.component';
import { HealthCoachRoutes } from 'app/modules/admin/apps/health-coach/health-coach.routing';

@NgModule({
    declarations: [
        HealthCoachComponent
    ],
    imports     : [
        RouterModule.forChild(HealthCoachRoutes)
    ]
})
export class HealthCoachModule
{
}
