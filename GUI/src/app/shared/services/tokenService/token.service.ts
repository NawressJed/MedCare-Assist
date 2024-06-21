import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  constructor(private _cookieService: CookieService) { }

  setAccessToken(token: string): void {
    this._cookieService.set('access_token', token);
  }

  setRefreshToken(token: string): void {
    this._cookieService.set('refresh_token', token);
  }

  getRefreshToken(): string | null {
    const token = this._cookieService.get('refresh_token');
    return token;
  }

  getAccessToken(): string | null {
    const token = this._cookieService.get('access_token');
    return token;
  }

  clearTokens(): void {
    this._cookieService.delete('access_token');
    this._cookieService.delete('refresh_token');
  }
}
