import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { ResetPassword } from '../../models/resetPassword/resetPassword';
import { Patient } from 'app/shared/models/users/patient/patient';
import { Doctor } from 'app/shared/models/users/doctor/doctor';
import { User } from 'app/shared/models/users/user';
import { CookieService } from 'ngx-cookie-service';
import { TokenService } from '../tokenService/token.service';
import { UserAuthService } from './user-auth.service';
import { UpdatePassword } from 'app/shared/models/updatePassword/update-password';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private baseUrl = 'http://localhost:8080/auth';

  requestHeader = new HttpHeaders(
    { "No-Auth": "True" }
  )

  constructor(private http: HttpClient,
    private _router: Router,
    private _userAuthService: UserAuthService,
    private _cookieService: CookieService,
    private tokenService: TokenService
  ) { }

  patientRegister(patient: Patient): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/patient_register`, patient);
  }

  doctorRegister(doctor: Doctor): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/doctor_register`, doctor);
  }

  signIn(user: User): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/authenticate`, user, { headers: this.requestHeader }).pipe(
      tap(response => {
        this.tokenService.setAccessToken(response.accessToken);
        this.tokenService.setRefreshToken(response.refreshToken);
        this._userAuthService.setRole(response.user.role)
        this._userAuthService.setEmail(response.user.email)
        this._userAuthService.setName(response.user.firstname)
        this._userAuthService.setId(response.user.id)
        this._userAuthService.setLastname(response.user.lastname)
      })
    );
  }

  forgetPassword(email: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/reset-password`, {}, { params: { email } });
  }

  resetPassword(token: string, resetPassword: ResetPassword): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/update-password?token=${token}`, resetPassword);
  }

  changePassword(id: string, updatePassword: UpdatePassword): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/change-password/${id}`, updatePassword);
  }

  logout(refreshToken: string): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<any>(`${this.baseUrl}/logout`, { refreshToken }, { headers }).pipe(
      tap(() => {
        this._cookieService.deleteAll();
        this.tokenService.clearTokens(); 
      })
    );
  }

  updateDoctor(id: string, doctor: any): Observable<string> {
    const authToken = this.tokenService.getAccessToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${authToken}`);
    return this.http.put<string>(`${this.baseUrl}/account/update/doctor/${id}`, doctor, { headers });
  }

  refreshToken(token: { refreshToken: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/refresh-token`, token).pipe(
      tap(response => {
          console.log("New access token received:", response.accessToken);
          this.tokenService.setAccessToken(response.accessToken);
      })
    );
  }

  errorRedirect(status: any): void {
    if(status === 403) {
      this._router.navigateByUrl('/error/403');
    } else if(status === 404) {
      this._router.navigateByUrl('/error/404');
    } else if(status === 500) {
      this.error500Redirect();
    }
  }

  error500Redirect(): void {
      this._router.navigateByUrl('/error/500');
  }

}
