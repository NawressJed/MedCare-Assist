import { Component, OnInit, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FuseCardComponent } from '@fuse/components/card';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { Appointment } from '../../../../shared/models/appointment/appointment';
import { Patient } from '../../../../shared/models/users/patient/patient';
import { AppointmentService } from 'app/shared/services/appointmentService/appointment.service';
import { CookieService } from 'ngx-cookie-service';
import { UserAuthService } from 'app/shared/services/authService/user-auth.service';
import { UserService } from 'app/shared/services/userService/user.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-appointment-add',
  templateUrl: './appointment-add.component.html',
  styles: [
    `
    /* Hide the default browser time input spinner */
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
    timeOptions: string[] = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30']; // Example time options


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
    private _datePipe: DatePipe,
    private _matDialogRef: MatDialogRef<AppointmentAddComponent>,
    private _cookie: CookieService
  ) { }

  ngOnInit(): void {
    this.fetchPatients();
  }

  saveAppointment() {
    this.appointment.date = new Date(this.appointment.date);
    this.appointmentService.createDoctorAppointment(this._cookie.get('id'), this.appointment).subscribe({
      next: (data) => {
        console.log(data);
        this.onCloseClick();
        
      },
      error: (e) => {
        console.log(e);
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
    this._userService.getPatientsList().subscribe((patients) => {
        this.listPatient = patients; 
    });
}

 // Method to handle time selection
 onTimeSelected(time: string): void {
  this.appointment.time = time; // Update the appointment model with the selected time
}

// Method to toggle the display of mat-select
toggleTimePicker(): void {
  // Open or close the mat-select dropdown
  const matSelect = document.querySelector('mat-select');
  if (matSelect) {
      (matSelect as HTMLElement).click(); // Cast matSelect to HTMLElement and trigger click event
  }
}

}
