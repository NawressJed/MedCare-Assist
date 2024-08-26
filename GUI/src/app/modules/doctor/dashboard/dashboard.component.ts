import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { User } from 'app/shared/models/users/user';
import { AppointmentService } from 'app/shared/services/appointmentService/appointment.service';
import { ReviewService } from 'app/shared/services/reviewService/review.service';
import { UserService } from 'app/shared/services/userService/user.service';
import { ApexOptions } from 'ng-apexcharts';
import { CookieService } from 'ngx-cookie-service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class DashboardComponent implements OnInit, AfterViewInit {
    chartGender: ApexOptions;

    authenticatedUser: User;
    authenticatedUserId: string;
    totalPatients: number;
    totalAppointments: number;
    totalReviews: number;
    genderData: any = {
        male: 0,
        female: 0,
        series: [],
        labels: ['Male', 'Female'],
    };
    ageData: any = {
        series: [40, 60], 
        labels: ['Under 30', 'Over 30'],
        colors: ['#FF6384', '#36A2EB'], 
    };

    chartAge: ApexOptions = {
        chart: {
            type: 'donut',
            height: '100%',
            animations: {
                speed: 400,
                animateGradually: {
                    enabled: false,
                },
            },
            fontFamily: 'inherit',
            foreColor: 'inherit',
            sparkline: {
                enabled: true,
            },
        },
        labels: this.ageData.labels,
        colors: ['#DD6B20', '#F6AD55'], 
        series: this.ageData.series,
        plotOptions: {
            pie: {
                customScale: 0.9,
                expandOnClick: false,
                donut: {
                    size: '70%',
                },
            },
        },
        states: {
            hover: {
                filter: {
                    type: 'none',
                },
            },
            active: {
                filter: {
                    type: 'none',
                },
            },
        },
        tooltip: {
            enabled: true,
            fillSeriesColor: false,
            theme: 'dark',
            custom: ({ seriesIndex, w }): string => `
            <div class="flex items-center h-8 min-h-8 max-h-8 px-3">
              <div class="w-3 h-3 rounded-full" style="background-color: ${w.config.colors[seriesIndex]};"></div>
              <div class="ml-2 text-md leading-none">${w.config.labels[seriesIndex]}:</div>
              <div class="ml-2 text-md font-bold leading-none">${w.config.series[seriesIndex]}%</div>
            </div>`,
        },
    };    

    constructor(
        private _apiUser: UserService,
        private _apiAppointment: AppointmentService,
        private _apiReview: ReviewService,
        private _cookie: CookieService,
        private changeDetectorRef: ChangeDetectorRef
    ) {
        this.initializeGenderChart();
    }

    ngOnInit(): void {
        this.authenticatedUserId = this._cookie.get('id');

        this.getAuthenticatedUser(this.authenticatedUserId);
        this.loadTotalPatients(this.authenticatedUserId);
        this.loadTotalAppointments(this.authenticatedUserId);
        this.loadTotalReviews(this.authenticatedUserId);
        this.loadGenderData(this.authenticatedUserId);
    }

    ngAfterViewInit() {
        if (
            this.chartGender &&
            this.genderData &&
            this.genderData.male !== undefined &&
            this.genderData.female !== undefined
        ) {
            this.updateGenderChartData([
                this.genderData.male,
                this.genderData.female,
            ]);
        } else {
            console.error(
                'Chart initialization error or gender data is not available'
            );
        }
    }

    getAuthenticatedUser(id: string): void {
        this._apiUser.getUser(id).subscribe({
            next: (result) => {
                this.authenticatedUser = result;
            },
        });
    }

    loadTotalPatients(doctorId: string): void {
        this._apiUser.getTotalPatients(doctorId).subscribe({
            next: (data) => {
                this.totalPatients = data;
            },
            error: (e) => {
                console.error('Failed to fetch total patients ', e);
            },
        });
    }

    loadTotalAppointments(doctorId: string): void {
        this._apiAppointment.getAppointmentCount(doctorId).subscribe({
            next: (data) => {
                this.totalAppointments = data;
            },
        });
    }

    loadTotalReviews(doctorId: string): void {
        this._apiReview.getReviewCount(doctorId).subscribe({
            next: (data) => {
                this.totalReviews = data;
            },
            error: (e) => {
                console.error('Failed to fetch total reviews ', e);
            },
        });
    }

    loadGenderData(doctorId: string): void {
        this._apiUser.getMalePatientsCount(doctorId).subscribe({
            next: (maleCount) => {
                this.genderData.male = maleCount;
                this._apiUser.getFemalePatientsCount(doctorId).subscribe({
                    next: (femaleCount) => {
                        this.genderData.female = femaleCount;
                        this.genderData.series = [maleCount, femaleCount];
                        this.updateGenderChartData(this.genderData.series);
                    },
                    error: (error) =>
                        console.error(
                            'Failed to fetch female patient count',
                            error
                        ),
                });
            },
            error: (error) =>
                console.error('Failed to fetch male patient count', error),
        });
    }

    initializeGenderChart(): void {
        this.chartGender = {
            chart: {
                type: 'donut',
                animations: {
                    enabled: true, // Ensure animations are enabled globally for the chart
                    speed: 400,
                    animateGradually: {
                        enabled: true, // Enable gradual animations
                        delay: 100 // Set a delay for the gradual animation effect
                    },
                    dynamicAnimation: {
                        enabled: true, // Enable dynamic animations
                        speed: 350 // Adjust the speed to match the age chart or as needed
                    }
                },
                fontFamily: 'inherit',
                foreColor: 'inherit',
                height: '100%',
                sparkline: {
                    enabled: true,
                },
            },
            colors: ['#3182CE', '#63B3ED'], 
            labels: ['Male', 'Female'],
            plotOptions: {
                pie: {
                    customScale: 0.9,
                    expandOnClick: false,
                    donut: {
                        size: '70%',
                    },
                },
            },
            series: [0, 0], // Ensure these values are dynamically updated as needed
            states: {
                hover: {
                    filter: {
                        type: 'none',
                    },
                },
                active: {
                    filter: {
                        type: 'none',
                    },
                },
            },
            tooltip: {
                enabled: true,
                fillSeriesColor: false,
                theme: 'dark',
                custom: ({
                    seriesIndex,
                    w,
                }): string => `<div class="flex items-center h-8 min-h-8 max-h-8 px-3">
                              <div class="w-3 h-3 rounded-full" style="background-color: ${w.config.colors[seriesIndex]};"></div>
                              <div class="ml-2 text-md leading-none">${w.config.labels[seriesIndex]}:</div>
                              <div class="ml-2 text-md font-bold leading-none">${w.config.series[seriesIndex]}</div>
                          </div>`,
            },
        };
    }    

    updateGenderChartData(counts: number[]): void {
        if (this.chartGender && counts && counts.length > 0) {
            this.chartGender.series = counts;
            this.changeDetectorRef.detectChanges();
        } else {
            console.warn(
                'Chart data is not ready or chartGender is not initialized'
            );
        }
    }
}
