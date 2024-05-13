import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FuseCardComponent } from '@fuse/components/card';
import { AppointmentAddComponent } from 'app/modules/admin/appointments-mgt/appointment-add/appointment-add.component';
import { Appointment } from 'app/shared/models/appointment/appointment';
import { Doctor } from 'app/shared/models/users/doctor/doctor';
import { AppointmentService } from 'app/shared/services/appointmentService/appointment.service';
import { UserAuthService } from 'app/shared/services/authService/user-auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-appointment-request',
  templateUrl: './appointment-request.component.html',
  styles: [
    `
        cards fuse-card {
            margin: 16px;
        }
    `
  ]
})
export class AppointmentRequestComponent implements OnInit {

  formFieldHelpers: string[] = [''];

  appointments: Observable<Appointment[]>;
  listDoctor: Doctor[] = [];

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
    this.fetchDoctors();
  }

  onSubmit() {
    this.submitted = true;
  }

  onCloseClick(): void {
    this._matDialogRef.close();
  }

  gotoList() {
    this.router.navigate(['patient/appointment/test']);
  }

fetchDoctors() {
    this.appointmentService.getAllDoctors().subscribe((doctors) => {
        this.listDoctor = doctors; 
    });
}

}
