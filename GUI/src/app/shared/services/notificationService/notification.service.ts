import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Appointment } from 'app/shared/models/appointment/appointment';
import { Notification } from 'app/shared/models/notification/notification';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private baseUrl = 'http://localhost:8080/notifications';

  constructor(private http: HttpClient) { }

  getRecipientNotifications(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/get-recipient-notifications/${id}`);
  }

  deleteNotification(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`, { responseType: 'text' });
  }

  requestAppointment(appointment: Appointment): Observable<Object> {
    return this.http.post(`${this.baseUrl}/request-appointment")`, appointment);
  }

  approveAppointment(appointment: Appointment):Observable<any> {
    return this.http.put(`${this.baseUrl}/approve/${appointment.id}`, null);
  }
}
