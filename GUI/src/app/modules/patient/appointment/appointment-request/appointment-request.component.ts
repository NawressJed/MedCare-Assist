import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FuseCardComponent } from '@fuse/components/card';
import { AppointmentAddComponent } from 'app/modules/admin/appointments-mgt/appointment-add/appointment-add.component';
import { Appointment } from 'app/shared/models/appointment/appointment';
import { Doctor } from 'app/shared/models/users/doctor/doctor';
import { AppointmentService } from 'app/shared/services/appointmentService/appointment.service';
import { UserAuthService } from 'app/shared/services/authService/user-auth.service';
import { UserService } from 'app/shared/services/userService/user.service';
import { WebSocketService } from 'app/shared/services/webSocketService/web-socket.service';
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
  selectedTime: string;
  timeOptions: string[] = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30'];

  @ViewChildren(FuseCardComponent, { read: ElementRef }) private _fuseCards: QueryList<ElementRef>;

  constructor(
    private appointmentService: AppointmentService,
    private _userService: UserService,
    private router: Router,
    private _matDialogRef: MatDialogRef<AppointmentAddComponent>,
    private _cookie: UserAuthService,
    private webSocketService: WebSocketService  // Inject WebSocketService
  ) { }

  ngOnInit(): void {
    this.fetchDoctors();
  }

  fetchDoctors() {
    this._userService.getDoctorsList().subscribe((doctors) => {
        this.listDoctor = doctors;
    });
  }

  onSubmit() {
    this.submitted = true;
    this.appointmentService.requestAppointment(this._cookie.getId(), this.appointment).subscribe((response: Appointment) => {
        console.log('Appointment request sent successfully:', response);

        // Send notification via WebSocket
        const message = `New appointment request from ${response.patient.firstname} ${response.patient.lastname}`;
        this.webSocketService.sendMessage('/app/notify', message);

        this._matDialogRef.close();
        this.gotoList();
    }, error => {
        console.error('Error sending appointment request:', error);
    });
  }

  onCloseClick(): void {
    this._matDialogRef.close();
  }

  gotoList() {
    this.router.navigate(['patient/appointment/test']);
  }

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
