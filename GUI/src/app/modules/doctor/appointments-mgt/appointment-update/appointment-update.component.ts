import { formatDate } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, Inject, NgZone, OnInit } from '@angular/core';
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

  selectedTime: string;
  timeOptions: string[] = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'];

  formFieldHelpers: string[] = [''];

  appointment: Appointment;
  listPatient: Patient[] = [];
  private dataLoaded: boolean = false; // Flag to avoid repeated changes

  constructor(
    private appointmentService: AppointmentService,
    private _userService: UserService,
    private router: Router,
    private _matDialogRef: MatDialogRef<AppointmentUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { appointment: Appointment },
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) { }

  ngOnInit(): void {
    this.appointment = this.data.appointment;
    this.selectedTime = this.appointment.time;
    this.fetchPatients();
    this.loadAppointmentData();
  }

  loadAppointmentData(): void {
    this.zone.runOutsideAngular(() => {
      this.appointmentService.getAppointment(this.appointment)
        .subscribe(data => {
          this.zone.run(() => {
            this.appointment = data;
            this.selectedTime = this.appointment.time;
            this.dataLoaded = true; 
            this.cdr.detectChanges();
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

  onSubmit() {
    this.updateAppointment();
  }

  onCloseClick(): void {
    this._matDialogRef.close();
  }

  fetchPatients() {
    this._userService.getDoctorPatientsList(this.appointment.doctor.id).subscribe((patients) => {
        this.listPatient = patients; 
    });
}

  onTimeSelected(time: string): void {
    this.appointment.time = time;
  }

  toggleTimePicker(): void {
    const matSelect = document.querySelector('mat-select');
    if (matSelect) {
      (matSelect as HTMLElement).click();
    }
  }
}
