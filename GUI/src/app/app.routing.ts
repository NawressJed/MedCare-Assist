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
    { path: '', pathMatch: 'full', redirectTo: 'sign-in' },

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
            { path: 'confirmation-required', loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.module').then(m => m.AuthConfirmationRequiredModule) },
            { path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.module').then(m => m.AuthForgotPasswordModule) },
            { path: 'reset-password', loadChildren: () => import('app/modules/auth/reset-password/reset-password.module').then(m => m.AuthResetPasswordModule) },
            { path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.module').then(m => m.AuthSignInModule) },
            { path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.module').then(m => m.AuthSignUpModule) },
        ]
    },

    // Error routes
    {
        path: 'error',
        children: [
            { path: '500', loadChildren: () => import('app/modules/pages/500/error-500.module').then(m => m.Error500Module) },
            { path: '403', loadChildren: () => import('app/modules/pages/403/error-403.module').then(m => m.Error403Module) },
            { path: '404', loadChildren: () => import('app/modules/pages/404/error-404.module').then(m => m.Error404Module) }
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
            { path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.module').then(m => m.AuthSignOutModule) },
            { path: 'unlock-session', loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.module').then(m => m.AuthUnlockSessionModule) }
        ]
    },

    // Landing routes
    {
        path: '',
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            { path: 'home', loadChildren: () => import('app/modules/landing/home/home.module').then(m => m.LandingHomeModule) },
        ]
    },

    {
        path: '',
        component: LayoutComponent,
        data: {
            layout: 'classic'
        },
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
            { path: 'profile', loadChildren: () => import('app/modules/profile/profile.module').then(m => m.ProfileModule) },
        ]
    },

    // Admin routes
    {
        path: 'admin',
        component: LayoutComponent,
        data: {
            layout: 'classic'
        },
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
            {
                path: 'patient', children: [
                    { path: 'list', loadChildren: () => import('app/modules/admin/usermgt/patientmgt/patient-list/patient-list.module').then(m => m.PatientListModule) },
                    { path: 'add', loadChildren: () => import('app/modules/admin/usermgt/patientmgt/patient-add/patient-add.module').then(m => m.PatientAddModule) },
                    { path: 'update/:id', loadChildren: () => import('app/modules/admin/usermgt/patientmgt/patient-update/patient-update.module').then(m => m.PatientUpdateModule) },
                ]
            },
            {
                path: 'doctor', children: [
                    { path: 'list', loadChildren: () => import('app/modules/admin/usermgt/doctormgt/doctor-list/doctor-list.module').then(m => m.DoctorListModule) },
                    { path: 'add', loadChildren: () => import('app/modules/admin/usermgt/doctormgt/doctor-add/doctor-add.module').then(m => m.DoctorAddModule) },
                    { path: 'update/:id', loadChildren: () => import('app/modules/admin/usermgt/doctormgt/doctor-update/doctor-update.module').then(m => m.DocotorUpdateModule) },
                ]
            },
            {
                path: 'appointments', children: [
                    { path: 'list', loadChildren: () => import('app/modules/admin/appointments-mgt/appointment-list/appointment-list.module').then(m => m.AppointmentListModule) },
                    { path: 'add', loadChildren: () => import('app/modules/admin/appointments-mgt/appointment-add/appointment-add.module').then(m => m.AppointmentAddModule) },
                ]
            },

        ]
    },

    //Doctor routes
    {
        path: 'doctor',
        component: LayoutComponent,
        data: {
            layout: 'classic'
        },
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
            {
                path: 'my-patients', children: [
                    { path: 'list', loadChildren: () => import('app/modules/doctor/my-patients/list/list.module').then(m => m.ListModule) },
                    { path: 'add', loadChildren: () => import('app/modules/doctor/my-patients/add/add.module').then(m => m.AddModule) },
                    {path: 'details/:id', loadChildren: () => import('app/modules/doctor/my-patients/details/details.module').then(m => m.DetailsModule)},
                ]
            },
            {
                path: 'medical-files', children: [
                    { path: 'add', loadChildren: () => import('app/modules/doctor/medicalFile/add/add.module').then(m => m.AddModule) },
                    {path: 'details/:id', loadChildren: () => import('app/modules/doctor/medicalFile/details/details.module').then(m => m.DetailsModule)},
                ]
            },
            {
                path: 'appointment', children: [
                    { path: 'list', loadChildren: () => import('app/modules/doctor/appointments-mgt/appointment-list/appointment-list.module').then(m => m.AppointmentListModule) },
                    { path: 'add', loadChildren: () => import('app/modules/doctor/appointments-mgt/appointment-add/appointment-add.module').then(m => m.AppointmentAddModule) },
                    { path: 'update', loadChildren: () => import('app/modules/doctor/appointments-mgt/appointment-update/appointment-update.module').then(m => m.AppointmentUpdateModule) },                    
                ]
            },
            {
                path: 'calendar', loadChildren: () => import('app/modules/doctor/calendar/calendar.module').then(m => m.CalendarModule) 
            }

        ]
    },

    //Patient routes
    {
        path: 'patient',
        component: LayoutComponent,
        data: {
            layout: 'classic'
        },
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
            {
                path: 'appointment', children: [
                    { path: 'test', loadChildren: () => import('app/modules/patient/appointment/testt/testt/testt.module').then(m => m.TesttModule)},
                    { path: 'request', loadChildren: () => import('app/modules/patient/appointment/appointment-request/appointment-request.module').then(m => m.AppointmentRequestModule) },
                    ]
            }

        ]
    }
];
