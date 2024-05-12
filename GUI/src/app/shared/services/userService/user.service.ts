import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Doctor } from 'app/shared/models/users/doctor/doctor';
import { Patient } from 'app/shared/models/users/patient/patient';
import { User } from 'app/shared/models/users/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'http://localhost:8080/user-management';

  constructor(private http: HttpClient) { }

  getUserByEmail(email: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/get-user-by-email/${email}`);
  }

  getPatient(patient: Patient): Observable<any> {
    return this.http.get(`${this.baseUrl}/get-patient/${patient.id}`);
  }

  getPatientsList(): Observable<any> {
    return this.http.get(`${this.baseUrl}/get-all-patients`);
  }

  createPatient(patient: Patient): Observable<Object> {
    return this.http.post(`${this.baseUrl}/add-patient`, patient);
  }

  updatePatient(id: string, value: any): Observable<Object> {
    return this.http.put(`${this.baseUrl}/update-patient/${id}`, value);
  }

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

  deleteUser(user: User): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete-user/${user.id}`, { responseType: 'text' });
  }
}


