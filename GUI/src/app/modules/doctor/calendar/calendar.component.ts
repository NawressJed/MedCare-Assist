import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import { Appointment } from 'app/shared/models/appointment/appointment';
import { User } from 'app/shared/models/users/user';
import { AppointmentService } from 'app/shared/services/appointmentService/appointment.service';
import { UserService } from 'app/shared/services/userService/user.service';
import { CookieService } from 'ngx-cookie-service';

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

  randomObjects = [];

  show = false;

  result: Appointment[];

  authenticatedUser: User;

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    locale: 'fr',
    weekends: true,
    plugins: [dayGridPlugin],
    height: 800,
    eventSources: Object.assign([], this.randomObjects),
    headerToolbar: {
      start: '',
      center: 'title',
      end: 'today prev,next'
    },
  };

  constructor(
    private _appointmentService: AppointmentService,
    private _datePipe: DatePipe,
    private _userService: UserService,
    private _cookieService: CookieService,
    private _formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.show = true;
    this.getAuthenticatedUser(this._cookieService.get('id'));
    this.getAppointments();
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
  
  getAuthenticatedUser(id: string): void {
    this._userService.getUser(id).subscribe({
      next:(result) => {
        this.authenticatedUser = result;
      }
    });
  }

  customizeCalendarOptions(): any {
    return {
      initialView: 'dayGridMonth',
      locale: 'FR',
      weekends: true,
      plugins: [dayGridPlugin],
      height: 800,
      eventSources: Object.assign([], this.randomObjects),
      headerToolbar: {
        start: '',
        center: 'title',
        end: 'today prev,next'
      },
    };
  }

  handleDateClick(arg) {
    alert('date click! ' + arg.dateStr);
  }

  filterAppointments(value): void {
    if(value === true) {
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

  formatTime(time: string): string {
    if (time) {
      return time.split(':').slice(0, 2).join(':'); // Extract hours and minutes and join them
    }
    return '';
  }

}
