import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'; // import interaction plugin
import { Appointment } from 'app/shared/models/appointment/appointment';
import { User } from 'app/shared/models/users/user';
import { AppointmentService } from 'app/shared/services/appointmentService/appointment.service';
import { UserService } from 'app/shared/services/userService/user.service';
import { CookieService } from 'ngx-cookie-service';
import { AddComponent } from './add/add.component';
import { MatDialog } from '@angular/material/dialog';
import { ScheduleService } from 'app/shared/services/scheduleService/schedule.service';
import { Schedule } from 'app/shared/models/schedule/schedule';
import { UpdateComponent } from './update/update.component';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  @ViewChild('calendar') calendarComponent: FullCalendarComponent;

  filter = this._formBuilder.group({
    pepperoni: false,
    extracheese: false,
    mushroom: false,
  });

  year: string;

  appointments: Appointment[];

  schedules: Schedule[];

  randomObjects = [];

  show = false;

  result: Appointment[];

  authenticatedUser: User;

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    locale: 'en',
    weekends: true,
    plugins: [dayGridPlugin, interactionPlugin],
    height: 800,
    eventSources: Object.assign([], this.randomObjects),
    headerToolbar: {
      start: '',
      center: 'title',
      end: 'today prev,next'
    },
    dateClick: this.handleDateClick.bind(this)
  };

  constructor(
    private _appointmentService: AppointmentService,
    private _datePipe: DatePipe,
    private _userService: UserService,
    private _cookieService: CookieService,
    private _formBuilder: FormBuilder,
    private _matDialog: MatDialog,
    private _scheduleService: ScheduleService
  ) { }

  ngOnInit(): void {
    this.show = true;
    this.getAuthenticatedUser(this._cookieService.get('id'));

  }

  getAppointments(): void {
    const appointments = [];
    this.year = new Date().getFullYear().toString();
    this._appointmentService.getDoctorAppointmentsList(this._cookieService.get('id')).subscribe({
      next: (result) => {
        this.appointments = result;
        for (const appointmentDate of result) {
          const title = `Appointment at ${this.formatTime(appointmentDate.time)}`;
          appointments.push({ title: title, date: this._datePipe.transform(appointmentDate.date, 'yyyy-MM-dd') });
        }
        const object = {
          id: 'appointments',
          events: appointments,
          color: 'primary'
        };
        this.randomObjects = [object, ...this.randomObjects];
        this.calendarOptions = this.customizeCalendarOptions();
      }
    });
  }

  getSchedules(): void {
    const schedules = [];
    this._scheduleService.getDoctorSchedules(this._cookieService.get('id')).subscribe({
      next: (result) => {
        this.schedules = result;
        for (const scheduleDate of result) {
          const title = `Not Available at ${this.formatTime(scheduleDate.startTime)}`;
          schedules.push({
            title: title,
            date: this._datePipe.transform(scheduleDate.date, 'yyyy-MM-dd'),
            extendedProps: {
              id: scheduleDate.id,
              available: scheduleDate.available
            }
          });
        }
        const object = {
          id: 'schedules',
          events: schedules,
          color: 'red'
        };
        this.randomObjects = [object, ...this.randomObjects];
        this.calendarOptions = this.customizeCalendarOptions();
      }
    });
  }


  getAuthenticatedUser(id: string): void {
    this._userService.getUser(id).subscribe({
      next: (result) => {
        this.authenticatedUser = result;
        this.getAppointments();
        this.getSchedules();
      }
    });
  }

  customizeCalendarOptions(): any {
    return {
      initialView: 'dayGridMonth',
      locale: 'EN',
      weekends: true,
      plugins: [dayGridPlugin, interactionPlugin],
      height: 800,
      eventSources: Object.assign([], this.randomObjects),
      headerToolbar: {
        start: '',
        center: 'title',
        end: 'today prev,next'
      },
      dateClick: this.handleDateClick.bind(this),
      eventClick: this.handleEventClick.bind(this),
    };
  }

  addNewSchedule(): void {
    const dialogRef = this._matDialog.open(AddComponent, {
      autoFocus: false,
      data: {
        doctorId: this.authenticatedUser.id
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getSchedules();
      }
    });
  }

  handleEventClick(arg): void {
    const event = arg.event;
    const scheduleId = event.extendedProps.id;

    const dialogRef = this._matDialog.open(UpdateComponent, {
      autoFocus: false,
      data: {
        scheduleId: scheduleId,
        doctorId: this.authenticatedUser.id,
        date: event.startStr,
        startTime: event.start,
        endTime: event.end,
        available: event.extendedProps.available
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getSchedules();
      }
    });
  }

  handleDateClick(arg): void {
    const dialogRef = this._matDialog.open(AddComponent, {
      autoFocus: false,
      data: {
        date: arg.dateStr,
        doctorId: this.authenticatedUser.id
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getSchedules();
      }
    });
  }

  filterAppointments(value): void {
    if (value === true) {
      this.getAppointments();
      this.calendarOptions = this.customizeCalendarOptions();
    } else {
      for (const object of this.randomObjects) {
        if (object.id === 'appointments') {
          this.randomObjects.splice(this.randomObjects.indexOf(object), 1);
        }
      }
      this.calendarOptions = this.customizeCalendarOptions();
    }
  }

  filterAvailability(value): void {
    if (value === true) {
      this.getSchedules();
      this.calendarOptions = this.customizeCalendarOptions();
    } else {
      for (const object of this.randomObjects) {
        if (object.id === 'schedules') {
          this.randomObjects.splice(this.randomObjects.indexOf(object), 1);
        }
      }
      this.calendarOptions = this.customizeCalendarOptions();
    }
  }

  formatTime(time: string): string {
    if (time) {
      return time.split(':').slice(0, 2).join(':');
    }
    return '';
  }

}
