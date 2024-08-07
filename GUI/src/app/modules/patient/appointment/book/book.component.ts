import { formatDate, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Appointment } from 'app/shared/models/appointment/appointment';
import { Doctor } from 'app/shared/models/users/doctor/doctor';
import { AppointmentService } from 'app/shared/services/appointmentService/appointment.service';
import { ReviewService } from 'app/shared/services/reviewService/review.service';
import { ScheduleService } from 'app/shared/services/scheduleService/schedule.service';
import { UserService } from 'app/shared/services/userService/user.service';
import { CookieService } from 'ngx-cookie-service';
import { forkJoin, map, Subject, takeUntil } from 'rxjs';
import { Schedule } from 'app/shared/models/schedule/schedule';
import { MatDialog } from '@angular/material/dialog';
import { FuseConfirmationDialogComponent } from '@fuse/services/confirmation/dialog/dialog.component';
import { FuseConfirmationService } from '@fuse/services/confirmation';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit {
  formFieldHelpers: string[] = [''];
  doctor: Doctor;
  appointment: Appointment = new Appointment();
  submitted = false;
  selectedDate: Date = new Date(); 
  selectedSlot: string | null = null;
  timeSlots: any[] = []; 

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private reviewService: ReviewService,
    private appointmentService: AppointmentService,
    private scheduleService: ScheduleService,
    private _cookie: CookieService,
    private dialog: MatDialog,
    private _location: Location,
    private _fuseConfirmationService: FuseConfirmationService,
  ) { }

  ngOnInit(): void {
    const doctorId = this.route.snapshot.paramMap.get('id');
    if (doctorId) {
      this.userService.getDoctor(doctorId).subscribe(doctor => {
        forkJoin({
          rating: this.reviewService.getAverageRating(doctor.id),
          reviewCount: this.reviewService.getReviewsByDoctor(doctor.id).pipe(
            map(reviews => reviews.length)
          )
        }).subscribe(({ rating, reviewCount }) => {
          this.doctor = { ...doctor, rating, reviewCount };
        });
      });

      this.onDateChange({ value: this.selectedDate });
    }
  }

  onDateChange(event: any): void {
    this.selectedDate = event.value;
    this.fetchSchedule(this.selectedDate);
  }

  fetchSchedule(date: Date): void {
    const doctorId = this.route.snapshot.paramMap.get('id');
    if (doctorId) {
      const formattedDate = formatDate(date, 'yyyy-MM-dd', 'en-US');
      this.scheduleService.getDoctorScheduleByDate(doctorId, formattedDate).subscribe(schedules => {
        this.timeSlots = this.generateTimeSlots(schedules);
      });
    }
  }

  generateTimeSlots(schedules: Schedule[]): any[] {
    const startHour = 9;
    const endHour = 18;
    const interval = 30; 
    const timeSlots = [];

    for (let hour = startHour; hour < endHour; hour++) {
        for (let minutes = 0; minutes < 60; minutes += interval) {
            const time = `${String(hour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
            let isAvailable = true;

            for (const schedule of schedules) {
                const [startHour, startMinute] = schedule.startTime.split(':').map(Number);
                const [endHour, endMinute] = schedule.endTime.split(':').map(Number);

                const slotTime = hour * 60 + minutes;
                const scheduleStartTime = startHour * 60 + startMinute;
                const scheduleEndTime = endHour * 60 + endMinute;

                if (slotTime >= scheduleStartTime && slotTime < scheduleEndTime) {
                    isAvailable = false;
                    break;
                }
            }

            timeSlots.push({ time, available: isAvailable });
        }
    }

    // Add the final slot of the day at 18:00
    timeSlots.push({ time: '18:00', available: true });

    return timeSlots;
}

  selectSlot(slot: any): void {
    if (slot.available) {
      this.selectedSlot = slot.time;
    }
  }

  onSubmit(): void {
    if (!this.selectedSlot) {
      alert('Please select a time slot.');
      return;
    }

    const confirmation = this._fuseConfirmationService.open( {
        title: 'Confirm Appointment Request',
        message: 'Are you sure you want to send this appointment request? <span class="font-medium">This action cannot be undone!</span>',
        icon: {
          show: true,
          name: 'heroicons_outline:check-circle',
          color: 'primary'
        },
        actions: {
          confirm: {
            show: true,
            label: 'Yes',
            color: 'accent'
          },
          cancel: {
            show: true,
            label: 'No'
          }
        },
        dismissible: true
      
    });

    confirmation.afterClosed().subscribe(result => {
      if (result) {
        this.submitted = true;

        this.appointment.date = formatDate(this.selectedDate, 'yyyy-MM-dd', 'en-US');
        this.appointment.time = this.selectedSlot;
        this.appointment.doctor = this.doctor;
        this.appointment.patient = this.userService.getPatient(this._cookie.get("id"));

        console.log('Appointment payload:', this.appointment);

        this.appointmentService.requestAppointment(this._cookie.get("id"), this.appointment).subscribe(
          (response: Appointment) => {
            console.log('Appointment request sent successfully:', response);
          },
          error => {
            console.error('Error sending appointment request:', error);
            alert('Error sending appointment request: ' + error.message);
          }
        );
      }
    });
  }

  goBack(): void {
    this._location.back();
  }
  
}
