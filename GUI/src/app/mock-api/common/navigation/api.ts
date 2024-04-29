import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { FuseNavigationItem } from '@fuse/components/navigation';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import { UserAuthService } from 'app/shared/services/authService/user-auth.service';

@Injectable({
    providedIn: 'root'
})

export class NavigationMockApi {

    role: string;

    private _defaultNavigation: FuseNavigationItem[] = [];

    /**
     * Constructor
     */
    constructor(
        private _router: Router,
        private _fuseMockApiService: FuseMockApiService,
        private _authService: UserAuthService) {
        // Register Mock API handlers
        this.registerHandlers();
    }


    /**
     * Register Mock API handlers
     */
    registerHandlers(): void {
        // -----------------------------------------------------------------------------------------------------
        // @ Navigation - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/common/navigation')
            .reply(() =>

                // Return the response
                [
                    200,
                    this.populateNavigation(),
                ]
            );
    }

    populateNavigation(): FuseNavigationItem[] {
        this._defaultNavigation = [];
        this.role = this._authService.getRole();
        if (this.role === 'ADMIN') {
            this._defaultNavigation.push(
                // {
                //     id: 'dashboard',
                //     title: 'NAVIGATION.DASHBOARD',
                //     type: 'basic',
                //     icon: 'heroicons_outline:chart-pie',
                //     link: '/dashboard',
                //     badge: {
                //         title: 'W.I.P',
                //         classes: 'px-2 bg-primary text-white rounded-full'
                //     }
                // },
                {
                    id: 'profile',
                    title: 'NAVIGATION.MY_PROFILE',
                    type: 'basic',
                    icon: 'heroicons_outline:user-circle',
                    link: ''
                },
                {
                    id: 'patients',
                    title: 'Patients',
                    type: 'basic',
                    icon: 'heroicons_outline:users',
                    link: '/admin/patient/list'
                },
                {
                    id: 'doctors',
                    title: 'Doctors',
                    type: 'basic',
                    icon: 'heroicons_outline:users',
                    link: '/admin/doctor/list'
                },
                {
                    id: 'appointments',
                    title: 'Appointments',
                    type: 'basic',
                    icon: 'heroicons_outline:calendar',
                    link: '/admin/appointment/list'
                },
                {
                    id: 'settings',
                    title: 'Settings',
                    type: 'basic',
                    icon: '',
                    link: '/admin/settings'
                }
            );
        }
        if (this.role === 'DOCTOR') {
            this._defaultNavigation.push(
                // {
                //     id: 'dashboard',
                //     title: 'NAVIGATION.DASHBOARD',
                //     type: 'basic',
                //     icon: 'heroicons_outline:chart-pie',
                //     link: '/dashboard',
                //     badge: {
                //         title: 'W.I.P',
                //         classes: 'px-2 bg-primary text-white rounded-full'
                //     }
                // },
                {
                    id: 'profile',
                    title: 'NAVIGATION.MY_PROFILE',
                    type: 'basic',
                    icon: 'heroicons_outline:user-circle',
                    link: ''
                },
                {
                    id: 'profile',
                    title: 'NAVIGATION.MY_PROFILE',
                    type: 'basic',
                    icon: 'heroicons_outline:user-circle',
                    link: ''
                }
            );
        }
        if (this.role === 'PATIENT') {
            this._defaultNavigation.push(
                // {
                //     id: 'tlDashboard',
                //     title: 'NAVIGATION.DASHBOARD',
                //     type: 'basic',
                //     icon: 'heroicons_outline:chart-pie',
                //     link: 'team/dashboard',
                //     badge: {
                //         title: 'W.I.P',
                //         classes: 'px-2 bg-primary text-white rounded-full'
                //     }
                // },
                {
                    id: 'org',
                    title: 'NAVIGATION.ORGANIZATIONAL_CHART',
                    type: 'basic',
                    icon: '',
                    link: ''
                },
                {
                    id: 'profile',
                    title: 'NAVIGATION.MY_PROFILE',
                    type: 'basic',
                    icon: 'heroicons_outline:user-circle',
                    link: ''
                }
            );
        }
        if (this._defaultNavigation.length === 0) {
            this._authService.error500Redirect();
        }
        return this._defaultNavigation;
    }
}
