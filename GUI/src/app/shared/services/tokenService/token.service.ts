import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  constructor(private http: HttpClient, private _cookieService: CookieService) { }

  setAccessToken(token: string): void {
    console.log('Setting access token:', token);
    this._cookieService.set('access_token', token);
  }

  setRefreshToken(token: string): void {
    console.log('Setting refresh token:', token);
    this._cookieService.set('refresh_token', token);
  }

  getRefreshToken(): string | null {
    const token = this._cookieService.get('refresh_token');
    console.log('Retrieved refresh token:', token);
    return token;
  }

  getAccessToken(): string | null {
    const token = this._cookieService.get('access_token');
    console.log('Retrieved access token:', token);
    return token;
  }

  isTokenExpired(token: string): boolean {
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    return Math.floor((new Date).getTime() / 1000) >= expiry;
  }

  refreshAccessToken(): Observable<string | null> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return of(null);
    }

    return this.http.post<any>('/api/auth/refresh-token', { refreshToken }).pipe(
      map(response => {
        if (response.accessToken) {
          this.setAccessToken(response.accessToken);
          return response.accessToken;
        }
        return null;
      }),
      catchError(error => {
        console.error('TokenService: Failed to refresh token', error);
        return of(null);
      })
    );
  }

  logout() {
    this._cookieService.delete('access_token');
    this._cookieService.delete('refresh_token');
    // Add any additional logout handling logic here (e.g., redirect to login)
  }
}
