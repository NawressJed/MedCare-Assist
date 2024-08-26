import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { AppointmentService } from 'app/shared/services/appointmentService/appointment.service';
import { Appointment } from 'app/shared/models/appointment/appointment';
import { map } from 'rxjs/operators';
import moment from 'moment';
import { CookieService } from 'ngx-cookie-service';
import { ReviewComponent } from '../review/review.component';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'app/shared/models/users/user';

@Component({
  selector: 'app-past',
  templateUrl: './past.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PastComponent implements OnInit {

  activities$: Observable<Appointment[]>;

  authenticatedUser: User;

  constructor(
    private appointmentService: AppointmentService,
    private _cookie: CookieService,
    private _matDialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.loadPastAppointments();
  }

  loadPastAppointments(): void {
    this.activities$ = this.appointmentService.getPatientAppointmentsList(this._cookie.get("id")).pipe(
      map(appointments => appointments
        .filter(app => app.appointmentStatus === 'DONE')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())  // Sorting here by date descending
      )
    );
  }
  

  reviewDoctor(appointment: Appointment): void {
    this._matDialog.open(ReviewComponent, {
      autoFocus: false,
      data: {
        appointmentId: appointment.id,
        doctorId: appointment.doctor.id,
        patientId: this._cookie.get("id")
      }
    });
  }

  isSameDay(current: string, compare: string): boolean {
    return moment(current, moment.ISO_8601).isSame(moment(compare, moment.ISO_8601), 'day');
  }

  getRelativeFormat(date: string): string {
    const today = moment().startOf('day');
    const yesterday = moment().subtract(1, 'day').startOf('day');

    if (moment(date, moment.ISO_8601).isSame(today, 'day')) {
      return 'Today';
    }

    if (moment(date, moment.ISO_8601).isSame(yesterday, 'day')) {
      return 'Yesterday';
    }

    return moment(date, moment.ISO_8601).fromNow();
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

}
