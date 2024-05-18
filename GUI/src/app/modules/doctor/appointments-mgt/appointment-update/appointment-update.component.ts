import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Appointment } from 'app/shared/models/appointment/appointment';
import { Patient } from 'app/shared/models/users/patient/patient';
import { AppointmentService } from 'app/shared/services/appointmentService/appointment.service';
import { UserService } from 'app/shared/services/userService/user.service';

@Component({
  selector: 'app-appointment-update',
  templateUrl: './appointment-update.component.html',
  styleUrls: ['./appointment-update.component.scss']
})
export class AppointmentUpdateComponent implements OnInit {

  formFieldHelpers: string[] = [''];

  appointment: Appointment
  listPatient: Patient[] = [];

  constructor(
    private appointmentService: AppointmentService,
    private _userService: UserService,
    private router: Router,
    private _matDialogRef: MatDialogRef<AppointmentUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { appointment: Appointment },
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.fetchPatients();

    this.appointment = this.data.appointment;
  
    setTimeout(() => {
      this.appointmentService.getAppointment(this.appointment)
        .subscribe(data => {
          console.log(data);
          this.appointment = data;
          this.cdr.detectChanges(); 
        }, error => console.log(error));
    });
  }

  updateAppointment() {
    this.appointmentService.updateAppointment(this.appointment.id, this.appointment)
      .subscribe(data => {
        console.log(data);
        this.appointment = new Appointment();
        this.onCloseClick();
      }, error => console.log(error));
  }


  onSubmit() {
    this.updateAppointment();
  }

  onCloseClick(): void {
    this._matDialogRef.close();
  }

  fetchPatients() {
    this._userService.getPatientsList().subscribe((patients) => {
        this.listPatient = patients; 
    });
}

}
