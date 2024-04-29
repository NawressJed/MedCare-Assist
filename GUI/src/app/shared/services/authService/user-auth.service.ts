import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from '../userService/user.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  domain: string;

  constructor(
    private _cookie: CookieService,
    private _userService: UserService,
    private _router: Router,
    private http: HttpClient
  ) { }

  public setRole(role: string) {
    this._cookie.set("role", role);
  }

  public getRole() {
    return this._cookie.get("role")
  }

  public setEmail(email: string) {
    this._cookie.set("email", email);
  }

  public getEmail() {
    return this._cookie.get("email")
  }

  public setName(name: string) {
    this._cookie.set("name", name);
  }

  public getName() {
    return this._cookie.get("name")
  }

  public setLastname(lastname: string) {
    this._cookie.set("lastname", lastname);
  }

  public getLastname() {
    return this._cookie.get("lastname")
  }
  
  public setId(id: string) {
    this._cookie.set("id", id)
  }

  public getId() {
    return this._cookie.get("id")
  }

  public setRefreshToken(refreshToken: string) {
    this._cookie.set("refreshToken", refreshToken);
  }

  public getRefreshToken(): string {
    return this._cookie.get("refreshToken");
  }

  public setAccessToken(accessToken: string) {
    this._cookie.set("accessToken", accessToken);
  }

  public getAccessToken(): string {
    return this._cookie.get("accessToken");
  }

  public clear() {
    this._cookie.deleteAll();
  }

  public isLoggedIn() {
    return this.getRole() && this.getRefreshToken();
  }

  public getUserInfo(accessToken: string, refreshToken: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${accessToken}`,
      })
    };

    this.http.get<any>('https://' + this.domain + '/oauth2/userInfo', httpOptions)
      .subscribe({
        next: (data) => {
          const email = data.email;
          // Set tokens in cookies
          this._cookie.set("accessToken", accessToken);
          this._cookie.set("refreshToken", refreshToken);
          // Store email in cookie
          this._cookie.set("EMAIL", email);

          // Assuming you have a method to get user info from backend using email
          this._userService.getUserByEmail(email).subscribe({
            next: (res) => {
              if (res) {
                // Set user info in cookies
                this._cookie.set("NAME", res.firstName);
                this._cookie.set("LASTNAME", res.lastName);
                this._cookie.set("ROLE", res.role);
                this._cookie.set("ID", res.id);
                // Redirect or perform other actions after sign-in
                this.redirectAfterSignIn(res.role);
              } else {
                this.error500Redirect();
              }
            },
            error: () => {
              this.error500Redirect();
            }
          });
        },
        error: () => {
          this.error500Redirect();
        }
      });
  }

  redirectAfterSignIn(role: string) {
    switch (role) {
      case 'ADMIN':
        this._router.navigateByUrl('');
        break;
      case 'DOCTOR':
        this._router.navigateByUrl('/doctor');
        break;
      case 'PATIENT':
        this._router.navigateByUrl('');
        break;
    }
  }

  error500Redirect(): void {
      this._router.navigateByUrl('/error/500');
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
}
