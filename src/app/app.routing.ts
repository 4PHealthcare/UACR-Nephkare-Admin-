import { Route } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { InitialDataResolver } from 'app/app.resolvers';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [

    // Redirect empty path to '/dashboards/project'
    {path: '', pathMatch : 'full', redirectTo: 'dashboards/project'},

    // Redirect signed in user to the '/dashboards/project'
    //
    // After the user signs in, the sign in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    {path: 'signed-in-redirect', pathMatch : 'full', redirectTo: 'dashboards/project'},

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.module').then(m => m.AuthForgotPasswordModule)},
            {path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.module').then(m => m.AuthSignInModule)},
        ]
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.module').then(m => m.AuthSignOutModule)},
        ]
    },

    // Landing routes
    {
        path: '',
        component  : LayoutComponent,
        data: {
            layout: 'empty'
        },
        children   : [
            {path: 'home', loadChildren: () => import('app/modules/landing/home/home.module').then(m => m.LandingHomeModule)},
        ]
    },

    // Admin routes
    {
        path       : '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component  : LayoutComponent,
        resolve    : {
            initialData: InitialDataResolver,
        },
        children   : [

            // Dashboards
            {path: 'dashboards', children: [
                {path: 'project', loadChildren: () => import('app/modules/admin/dashboards/project/project.module').then(m => m.ProjectModule)},
                {path: 'payments', loadChildren: () => import('app/modules/admin/dashboards/payments/payments.module').then(m => m.PaymentsModule)},
                {path: 'hubspot', loadChildren: () => import('app/modules/admin/dashboards/hubspot/hubspot.module').then(m => m.HubspotModule)},
            ]},

            // Apps
            {path: 'apps', children: [
                {path: 'academy', loadChildren: () => import('app/modules/admin/apps/subscriptions/subscriptions.module').then(m => m.SubscriptionsModule)},
                {path: 'care-team', loadChildren: () => import('app/modules/admin/apps/care-team/care-team.module').then(m => m.CareTeamModule)},
                {path: 'users', loadChildren: () => import('app/modules/admin/apps/users/users.module').then(m => m.UsersModule)},
                {path: 'doctors', loadChildren: () => import('app/modules/admin/apps/doctors/doctors.module').then(m => m.DoctorsModule)},
                {path: 'hospital-patient-list', loadChildren: () => import('app/modules/admin/apps/doctors/doc-hosp-pat-ls/doc-hosp-pat-ls.component.module').then(m => m.DocHospPatLsModule)},
                {path: 'license', loadChildren: () => import('app/modules/admin/apps/hospital-license/hospital-license.module').then(m => m.HosplitalLicenseModule)},
                {path: 'file-manager', loadChildren: () => import('app/modules/admin/apps/file-manager/file-manager.module').then(m => m.FileManagerModule)},
                {path: 'help-center', loadChildren: () => import('app/modules/admin/apps/help-center/help-center.module').then(m => m.HelpCenterModule)},
                {path: 'scrumboard', loadChildren: () => import('app/modules/admin/apps/scrumboard/scrumboard.module').then(m => m.ScrumboardModule)},
                {path: 'tasks', loadChildren: () => import('app/modules/admin/apps/tasks/tasks.module').then(m => m.TasksModule)},
                {path: 'customersupport', loadChildren: () => import('app/modules/admin/apps/customer-support/customer-support.module').then(m => m.CustomerSupportModule)},
                {path: 'health-coach', loadChildren: () => import('app/modules/admin/apps/health-coach/health-coach.module').then(m => m.HealthCoachModule)},
                {path: 'health-workers', loadChildren: () => import('app/modules/admin/apps/health-workers/health-workers.module').then(m => m.HealthWorkersModule)},

            ]},

            // Pages
            {path: 'pages', children: [

                // Activities
                {path: 'activities', loadChildren: () => import('app/modules/admin/pages/activities/activities.module').then(m => m.ActivitiesModule)},

                // role
                {path: 'roles', loadChildren: () => import('app/modules/admin/pages/roles/roles.module').then(m => m.RolesModule)},

                // Error
                {path: 'error', children: [
                    {path: '404', loadChildren: () => import('app/modules/admin/pages/error/error-404/error-404.module').then(m => m.Error404Module)},
                    {path: '500', loadChildren: () => import('app/modules/admin/pages/error/error-500/error-500.module').then(m => m.Error500Module)}
                ]},

                // Invoice
                {path: 'invoice', children: [
                    {path: 'printable', children: [
                        {path: 'compact', loadChildren: () => import('app/modules/admin/pages/invoice/printable/compact/compact.module').then(m => m.CompactModule)},
                        {path: 'modern', loadChildren: () => import('app/modules/admin/pages/invoice/printable/modern/modern.module').then(m => m.ModernModule)}
                    ]}
                ]},


                // Profile
                {path: 'profile', loadChildren: () => import('app/modules/admin/pages/profile/profile.module').then(m => m.ProfileModule)},

                // Settings
                {path: 'settings', loadChildren: () => import('app/modules/admin/pages/settings/settings.module').then(m => m.SettingsModule)},
                
                //Notes
                {path: 'notes', loadChildren: () => import('app/modules/admin/apps/notes/notes.module').then(m => m.NotesModule)},

                //chat
                {path: 'chat', loadChildren: () => import('app/modules/admin/pages/chat/chat.module').then(m => m.ChatModule)},

                 //Notes
                 {path: 'blogs', loadChildren: () => import('app/modules/admin/pages/blogs/blogs.module').then(m => m.BlogsModule)},

                  //Community
                  {path: 'community', loadChildren: () => import('app/modules/admin/pages/community/community.module').then(m => m.CommunityModule)}

            ]},

            

            // 404 & Catch all
            {path: '404-not-found', pathMatch: 'full', loadChildren: () => import('app/modules/admin/pages/error/error-404/error-404.module').then(m => m.Error404Module)},
            {path: '**', redirectTo: '404-not-found'}
        ]
    }
];
