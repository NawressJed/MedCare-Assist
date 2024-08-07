import { Component, OnInit, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FuseCardComponent } from '@fuse/components/card';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Appointment } from '../../../../shared/models/appointment/appointment';
import { Patient } from '../../../../shared/models/users/patient/patient';
import { AppointmentService } from 'app/shared/services/appointmentService/appointment.service';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from 'app/shared/services/userService/user.service';
import { DatePipe, formatDate } from '@angular/common';
import { ScheduleService } from 'app/shared/services/scheduleService/schedule.service';
import { Schedule } from 'app/shared/models/schedule/schedule';

@Component({
  selector: 'app-appointment-add',
  templateUrl: './appointment-add.component.html',
  styles: [
    `
      input[type="time"]::-webkit-calendar-picker-indicator {
          display: none;
      }

      cards fuse-card {
          margin: 16px;
      }
    `
  ]
})
export class AppointmentAddComponent implements OnInit {

  selectedTime: string;
  timeSlots: any[] = [];
  selectedDate: Date = new Date();  // Set to today's date by default
  selectedSlot: string | null = null;

  formFieldHelpers: string[] = [''];

  appointments: Observable<Appointment[]>;
  listPatient: Patient[] = [];

  appointment: Appointment = new Appointment();
  submitted = false;
  selectedImage: File | null = null;

  @ViewChildren(FuseCardComponent, { read: ElementRef }) private _fuseCards: QueryList<ElementRef>;

  constructor(
    private appointmentService: AppointmentService,
    private _userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private _datePipe: DatePipe,
    private _matDialogRef: MatDialogRef<AppointmentAddComponent>,
    private _cookie: CookieService,
    private scheduleService: ScheduleService
  ) { }

  ngOnInit(): void {
    this.appointment.date = this.selectedDate.toISOString();  
    this.fetchPatients();
    this.fetchSchedule(this.selectedDate); 
  }

  saveAppointment() {
    this.appointment.date = this._datePipe.transform(this.appointment.date, 'yyyy-MM-dd');
    this.appointment.time = this.selectedSlot;

    this.appointmentService.createDoctorAppointment(this._cookie.get("id"), this.appointment).subscribe({
      next: (data) => {
        console.log('Appointment created successfully', data);
      },
      error: (e) => {
        console.log('Error creating appointment', e);
      }
    });
  }

  onSubmit() {
    this.submitted = true;
    this.saveAppointment();
  }

  onCloseClick(): void {
    this._matDialogRef.close();
  }

  gotoList() {
    this.router.navigate(['doctor/appointment/list']);
  }

  fetchPatients() {
    const doctorId = this._cookie.get("id");
    this._userService.getDoctorPatientsList(doctorId).subscribe((patients) => {
        this.listPatient = patients; 
    });
  }

  onTimeSelected(time: string): void {
    this.selectedSlot = time;
    this.appointment.time = time;
  }

  onDateChange(event: any): void {
    this.selectedDate = event.value;
    this.fetchSchedule(this.selectedDate);
  }

  fetchSchedule(date: Date): void {
    const doctorId = this._cookie.get("id");
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

    timeSlots.push({ time: '18:00', available: true });

    return timeSlots;
  }

  selectSlot(slot: any): void {
    if (slot.available) {
      this.selectedSlot = slot.time;
    }
  }
}
