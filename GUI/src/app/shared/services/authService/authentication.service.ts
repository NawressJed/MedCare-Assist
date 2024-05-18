import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { ResetPassword } from '../../models/resetPassword/resetPassword';
import { Patient } from 'app/shared/models/users/patient/patient';
import { Doctor } from 'app/shared/models/users/doctor/doctor';
import { User } from 'app/shared/models/users/user';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private baseUrl = 'http://localhost:8080/auth';

  requestHeader = new HttpHeaders(
    { "No-Auth": "True"}
  )

  constructor(private http: HttpClient,
    private router: Router
  ) { }

  patientRegister(patient: Patient): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/patient_register`, patient);
  }

  doctorRegister(doctor: Doctor): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/doctor_register`, doctor);
  }

  signIn(user: User): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/authenticate`, user, { headers: this.requestHeader });
  }

  forgetPassword(email: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/reset-password`, email);
  }

  resetPassword(token: string, resetPassword: ResetPassword): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/update-password?token=${token}`, resetPassword);
  }

  logout(): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/logout`, {});
  }

}
