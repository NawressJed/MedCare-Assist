import { Component, OnInit, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FuseCardComponent } from '@fuse/components/card';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { Patient } from 'app/shared/models/users/patient/patient';
import { Appointment } from 'app/shared/models/appointment/appointment';
import { Doctor } from 'app/shared/models/users/doctor/doctor';
import { AppointmentService } from 'app/shared/services/appointmentService/appointment.service';

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
  listDoctor: Doctor[] = [];

  appointment: Appointment = new Appointment();
  submitted = false;
  selectedImage: File | null = null;

  @ViewChildren(FuseCardComponent, { read: ElementRef }) private _fuseCards: QueryList<ElementRef>;


  constructor(
    private appointmentService: AppointmentService,
    private router: Router,
    private _matDialogRef: MatDialogRef<AppointmentAddComponent>
  ) { }

  ngOnInit(): void {
    this.fetchPatients();
    this.fetchDoctors();
  }

  saveAppointment() {
    this.appointment.date = new Date(this.appointment.date);
    this.appointmentService.createAppointment(this.appointment).subscribe({
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
    this.gotoList();
  }

  onCloseClick(): void {
    this._matDialogRef.close();
  }

  gotoList() {
    this.router.navigate(['admin/appointment/list']);
  }

fetchPatients() {
    this.appointmentService.getAllPatients().subscribe((patients) => {
        this.listPatient = patients; 
    });
}

fetchDoctors() {
  this.appointmentService.getAllDoctors().subscribe((doctors) => {
      this.listDoctor = doctors; 
  });
}

}
