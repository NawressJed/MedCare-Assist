import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Appointment } from 'app/shared/models/appointment/appointment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private baseUrl = 'http://localhost:8080/appointment-management';

  constructor(private http: HttpClient) { }

  getAppointment(appointment: Appointment): Observable<any> {
    return this.http.get(`${this.baseUrl}/get-appointment/${appointment.id}`);
  }

  getAppointmentsList(): Observable<any> {
    return this.http.get(`${this.baseUrl}/get-all-appointments`);
  }

  getAllPatients(): Observable<any> {
    return this.http.get(`${this.baseUrl}/get-all-patients`);
  }

  getAllDoctors(): Observable<any> {
    return this.http.get(`${this.baseUrl}/get-all-doctors`);
  }

  createAppointment(appointment: Appointment): Observable<Object> {
    return this.http.post(`${this.baseUrl}/add-appointment`, appointment);
  }

  updateAppointment(id: string, value: any): Observable<Object> {
    return this.http.put(`${this.baseUrl}/update-appointment/${id}`, value);
  }

  deleteAppointment(appointment: Appointment): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete-appointment/${appointment.id}`, { responseType: 'text' });
  }
}
