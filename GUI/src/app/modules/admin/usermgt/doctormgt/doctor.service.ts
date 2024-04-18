import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Doctor } from './doctor';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  private baseUrl = 'http://localhost:8080/user-management';

  constructor(private http: HttpClient) { }

  getDoctor(doctor: Doctor): Observable<any> {
    return this.http.get(`${this.baseUrl}/get-doctor/${doctor.id}`);
  }

  getDoctorsList(): Observable<any> {
    return this.http.get(`${this.baseUrl}/get-all-doctors`);
  }

  createDoctor(doctor: Doctor): Observable<Object> {
    return this.http.post(`${this.baseUrl}/add-doctor`, doctor);
  }

  updateDoctor(id: string, value: any): Observable<Object> {
    return this.http.put(`${this.baseUrl}/update-doctor/${id}`, value);
  }

  deleteDoctor(doctor: Doctor): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete-doctor/${doctor.id}`, { responseType: 'text' });
  }
  
}
