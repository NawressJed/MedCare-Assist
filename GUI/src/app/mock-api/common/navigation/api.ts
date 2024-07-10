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
                    title: 'My Profile',
                    type: 'basic',
                    icon: 'heroicons_outline:user-circle',
                    link: '/profile'
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
        if (this.role === 'ROLE_DOCTOR') {
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
                    title: 'My Profile',
                    type: 'basic',
                    icon: 'heroicons_outline:user-circle',
                    link: '/profile'
                },
                {
                    id: 'patients',
                    title: 'My Patients',
                    type: 'basic',
                    icon: 'heroicons_outline:user-group',
                    link: '/doctor/my-patients/list'
                },
                {
                    id: 'appointments',
                    title: 'My Appointments',
                    type: 'basic',
                    icon: 'heroicons_outline:clipboard',
                    link: '/doctor/appointment/list'
                },
                {
                    id: 'calendar',
                    title: 'My Calendar',
                    type: 'basic',
                    icon: 'heroicons_outline:calendar',
                    link: '/doctor/calendar'
                },
                {
                    id: 'reviews',
                    title: 'Reviews',
                    type: 'basic',
                    icon: 'heroicons_outline:star',
                    link: '/doctor/reviews'
                },
                {
                    id: 'chat',
                    title: 'Chat',
                    type: 'basic',
                    icon: 'heroicons_outline:chat-alt',
                    link: '/chat'
                }
            );
        }
        if (this.role === 'ROLE_PATIENT') {
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
                    id: 'profile',
                    title: 'My Profile',
                    type: 'basic',
                    icon: 'heroicons_outline:user-circle',
                    link: '/profile'
                },
                {
                    id      : 'appointments',
                    title   : 'Appointments',
                    type    : 'collapsable',
                    icon    : 'heroicons_outline:clipboard',
                    children: [
                        {
                            id   : 'appointments.book',
                            title: 'Book Appointment',
                            type : 'basic',
                        },
                        {
                            id   : 'appointments.upcoming',
                            title: 'Upcoming Appointments',
                            type : 'basic',
                            link: '/patient/appointment/upcoming'
                        },
                        {
                            id   : 'appointments.past',
                            title: 'Past Appointments',
                            type : 'basic',
                            link: '/patient/appointment/past'
                        }
                    ]
                },
                {
                    id: 'medical files',
                    title: 'Medical Files',
                    type: 'basic',
                    icon: 'heroicons_outline:document-text',
                    link: '/patient/medicalfile/list'
                },
                {
                    id: 'chat',
                    title: 'Chat',
                    type: 'basic',
                    icon: 'heroicons_outline:chat-alt',
                    link: '/chat'
                }
            );
        }
        if (this._defaultNavigation.length === 0) {
            this._authService.error500Redirect();
        }
        return this._defaultNavigation;
    }
}
