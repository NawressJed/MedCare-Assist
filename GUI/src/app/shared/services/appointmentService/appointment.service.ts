import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Appointment } from '../../models/appointment/appointment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private baseUrl = 'http://localhost:8080/core-services';

  constructor(private http: HttpClient) { }

  getAppointment(appointment: Appointment): Observable<any> {
    return this.http.get(`${this.baseUrl}/get-appointment/${appointment.id}`);
  }

  getAppointmentsList(): Observable<any> {
    return this.http.get(`${this.baseUrl}/get-all`);
  }

  getDoctorAppointmentsList(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/doctor-get-appointment/${id}`);
  }

  getPatientAppointmentsList(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/patient-get-appointment/${id}`);
  }

  createAppointment(appointment: Appointment): Observable<Object> {
    return this.http.post(`${this.baseUrl}/add-appointment`, appointment);
  }

  createDoctorAppointment(id: string, appointment: Appointment): Observable<Object> {
    return this.http.post(`${this.baseUrl}/doctor-add-appointment/${id}`, appointment);
  }

  requestAppointment(id: string, appointment: any): Observable<Object> {
    return this.http.post(`${this.baseUrl}/request-appointment/${id}`, appointment);
  }

  approveAppointment(appointmentId: string): Observable<Object> {
    return this.http.put(`${this.baseUrl}/approve-appointment/${appointmentId}`, null);
  }

  rejectAppointment(appointmentId: string): Observable<Object> {
    return this.http.put(`${this.baseUrl}/reject-appointment/${appointmentId}`, null);
  }

  updateAppointment(id: string, value: any): Observable<Object> {
    return this.http.put(`${this.baseUrl}/update-appointment/${id}`, value);
  }

  updateStatus(id: string, status: string): Observable<Object> {
    return this.http.put(`${this.baseUrl}/update-status/${id}`, { status });
  }

  deleteAppointment(appointment: Appointment): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete-appointment/${appointment.id}`, { responseType: 'text' });
  }
}
