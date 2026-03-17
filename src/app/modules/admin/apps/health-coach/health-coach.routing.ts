import { Route } from '@angular/router';
import { HealthCoachComponent } from 'app/modules/admin/apps/health-coach/health-coach.component';

export const HealthCoachRoutes: Route[] = [
    {
        path     : '',
        component: HealthCoachComponent
    }
];
