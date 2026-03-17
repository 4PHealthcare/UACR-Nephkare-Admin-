import { Route } from '@angular/router';
import { HosplitalLicenseComponent } from './hospital-license.component';
import { ContactsCountriesResolver } from 'app/modules/admin/apps/contacts/contacts.resolvers';

export const HosplitalLicenseRoutes: Route[] = [
    {
        path      : '',
        pathMatch : 'full', 
        component: HosplitalLicenseComponent,
        children : [
            {
                path     : '',
                component: HosplitalLicenseComponent,
                resolve  : {
                    countries : ContactsCountriesResolver
                }
            }
        ]
    }
    
];
