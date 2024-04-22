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
    { path: '', pathMatch: 'full', redirectTo: 'dashboards/project' },

    // Redirect signed in user to the '/dashboards/project'
    //
    // After the user signs in, the sign in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    { path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'dashboards/project' },

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
            { path: 'admin/settings', loadChildren: () => import('app/modules/account-management/settings.module').then(m => m.SettingsModule) },
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

    // Admin routes
    {
        path: 'admin',
        component: LayoutComponent,
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
                path: 'settings', loadChildren: () => import('app/modules/account-management/settings.module').then(m => m.SettingsModule) 
            }

        ]
    },

    //Doctor routes
    {
        path: 'doctor',
        component: LayoutComponent,
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
            {   path: 'appointments', loadChildren: () => import('app/modules/account-management/settings.module').then(m => m.SettingsModule) },
            {   path: 'medical-files', loadChildren: () => import('app/modules/account-management/settings.module').then(m => m.SettingsModule) },
        ]
    }
];
