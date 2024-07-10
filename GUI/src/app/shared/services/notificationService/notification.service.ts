import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private baseUrl = 'http://localhost:8080/core-services';

  constructor(private http: HttpClient) { }

  getNotifications(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/get-notifications/${id}`);
  }

  getNotificationById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/get-notification/${id}`);
  }

  markAsRead(notificationId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/read/${notificationId}`, {});
  }
}
