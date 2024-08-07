import { formatDate } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, Inject, NgZone, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Appointment } from 'app/shared/models/appointment/appointment';
import { Patient } from 'app/shared/models/users/patient/patient';
import { AppointmentService } from 'app/shared/services/appointmentService/appointment.service';
import { UserService } from 'app/shared/services/userService/user.service';
import { ScheduleService } from 'app/shared/services/scheduleService/schedule.service';
import { Schedule } from 'app/shared/models/schedule/schedule';

@Component({
  selector: 'app-appointment-update',
  templateUrl: './appointment-update.component.html',
  styleUrls: ['./appointment-update.component.scss']
})
export class AppointmentUpdateComponent implements OnInit {

  selectedTime: string;
  timeSlots: any[] = [];
  selectedDate: Date;
  formFieldHelpers: string[] = [''];

  appointment: Appointment;
  listPatient: Patient[] = [];
  private dataLoaded: boolean = false; // Flag to avoid repeated changes

  constructor(
    private appointmentService: AppointmentService,
    private _userService: UserService,
    private scheduleService: ScheduleService,
    private router: Router,
    private _matDialogRef: MatDialogRef<AppointmentUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { appointment: Appointment },
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) { }

  ngOnInit(): void {
    this.appointment = this.data.appointment;
    this.selectedTime = this.appointment.time;
    this.selectedDate = new Date(this.appointment.date); 
    this.fetchPatients();
    this.fetchSchedule(this.selectedDate); 
    this.loadAppointmentData();
  }

  loadAppointmentData(): void {
    this.zone.runOutsideAngular(() => {
      this.appointmentService.getAppointment(this.appointment)
        .subscribe(data => {
          this.zone.run(() => {
            this.appointment = data;
            this.selectedTime = this.appointment.time;
            this.selectedDate = new Date(this.appointment.date);
            this.fetchSchedule(this.selectedDate); 
            this.fetchPatients();
          });
        }, error => console.log(error));
    });
  }

  updateAppointment() {
    this.appointment.date = formatDate(this.appointment.date, 'yyyy-MM-dd', 'en-US');
    
    // Ensure the time is set
    if (!this.selectedTime) {
        console.error('Time is required.');
        return;
    }
    this.appointment.time = this.selectedTime;

    this.appointmentService.updateAppointment(this.appointment.id, this.appointment)
      .subscribe(data => {
        console.log(data);
        this.appointment = new Appointment();
        this.onCloseClick();
      }, error => console.log(error));
  }

  setStatus(appointment: Appointment, status: string): void {
    appointment.appointmentStatus = status;
    this.appointmentService.updateStatus(appointment.id, status);
}

  onSubmit() {
    this.updateAppointment();
  }

  onCloseClick(): void {
    this._matDialogRef.close();
  }

  fetchPatients() {
    this._userService.getDoctorPatientsList(this.appointment.doctor.id).subscribe((patients) => {
        this.listPatient = patients; 
        this.cdr.detectChanges();
    });
  }

  onTimeSelected(time: string): void {
    this.selectedTime = time;
    this.appointment.time = time;
  }

  onDateChange(event: any): void {
    this.selectedDate = event.value;
    this.fetchSchedule(this.selectedDate);
  }

  fetchSchedule(date: Date): void {
    const doctorId = this.appointment.doctor.id;
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
      this.selectedTime = slot.time;
    }
  }
}
