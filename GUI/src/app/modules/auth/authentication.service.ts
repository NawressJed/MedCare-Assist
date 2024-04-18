import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { Patient } from './patient';
import { User } from './user';
import { Doctor } from './doctor';
import { ResetPassword } from './resetPassword';
import { ForgetPassword } from './forgetPassword';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private baseUrl = 'http://localhost:8080/auth';

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
    return this.http.post<any>(`${this.baseUrl}/authenticate`, user);
  }

  forgetPassword(forgetPassword: ForgetPassword): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/reset-password`, forgetPassword);
  }

  resetPassword(token: string, resetPassword: ResetPassword): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/update-password?token=${token}`, resetPassword);
  }


  validateResetToken(token: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/validate-reset-token?token=${token}`).pipe(
      tap(
        () => {
          // Token is valid, navigate to the reset password page
          this.router.navigate(['/reset-password']);
        },
        error => {
          // Token is invalid, redirect to home page
          this.router.navigate(['/']);
        }
      )
    );
  }

}
