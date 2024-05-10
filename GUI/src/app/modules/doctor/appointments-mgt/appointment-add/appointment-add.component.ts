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

@Component({
  selector: 'app-appointment-add',
  templateUrl: './appointment-add.component.html',
  styles: [
    `
        cards fuse-card {
            margin: 16px;
        }
    `
  ]
})
export class AppointmentAddComponent implements OnInit {

  formFieldHelpers: string[] = [''];

  appointments: Observable<Appointment[]>;
  listPatient: Patient[] = [];

  appointment: Appointment = new Appointment();
  submitted = false;
  selectedImage: File | null = null;

  @ViewChildren(FuseCardComponent, { read: ElementRef }) private _fuseCards: QueryList<ElementRef>;


  constructor(
    private appointmentService: AppointmentService,
    private router: Router,
    private _matDialogRef: MatDialogRef<AppointmentAddComponent>,
    private _cookie: UserAuthService
  ) { }

  ngOnInit(): void {
    this.fetchPatients();
  }

  saveAppointment() {
    this.appointment.date = new Date(this.appointment.date);
    this.appointmentService.createDoctorAppointment(this._cookie.getId(), this.appointment).subscribe({
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
    this.appointmentService.getAllPatients().subscribe((patients) => {
        this.listPatient = patients; 
    });
}

}
