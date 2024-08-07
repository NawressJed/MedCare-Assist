import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Schedule } from 'app/shared/models/schedule/schedule';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  private baseUrl = 'http://localhost:8080/core-services';

  constructor(private http: HttpClient) { }

  createSchedule(doctorId: string, schedule: Schedule): Observable<Schedule> {
    return this.http.post<Schedule>(`${this.baseUrl}/create-schedule/${doctorId}`, schedule);
  }

  updateSchedule(id: string, schedule: Schedule): Observable<Schedule> {
    return this.http.put<Schedule>(`${this.baseUrl}/update-schedule/${id}`, schedule);
  }

  deleteSchedule(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete-schedule/${id}`);
  }

  getDoctorSchedules(doctorId: string): Observable<Schedule[]> {
    return this.http.get<Schedule[]>(`${this.baseUrl}/get-doctor-schedule/${doctorId}`);
  }

  getScheduleById(scheduleId: string): Observable<Schedule> {
    return this.http.get<Schedule>(`${this.baseUrl}/get-schedule/${scheduleId}`);
  }

  getDoctorScheduleByDate(doctorId: string, date: string): Observable<Schedule[]> {
    return this.http.get<Schedule[]>(`${this.baseUrl}/get-doctor-schedule/${doctorId}/date?date=${date}`);
  }  

}
