import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Appointment } from 'app/shared/models/appointment/appointment';
import { AppointmentService } from 'app/shared/services/appointmentService/appointment.service';

@Component({
    selector: 'app-update',
    templateUrl: './update.component.html',
    styleUrls: ['./update.component.scss'],
})
export class UpdateComponent implements OnInit {
    appointment: Appointment;

    constructor(
        private appointmentService: AppointmentService,
        private _matDialogRef: MatDialogRef<UpdateComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { appointment: Appointment }
    ) {}

    ngOnInit(): void {
        this.appointment = this.data.appointment;
    }

    onSubmit() {
      this.updateAppointment();
    }

    updateAppointment() {
        this.appointmentService
            .updateAppointment(this.appointment.id, this.appointment)
            .subscribe(
                (data) => {
                    console.log(data);
                    this.appointment = new Appointment();
                    this.onCloseClick();
                },
                (error) => console.log(error)
            );
    }

    setStatus(appointment: Appointment, status: string): void {
        appointment.appointmentStatus = status;
    }

    onCloseClick(): void {
        this._matDialogRef.close();
    }
}
