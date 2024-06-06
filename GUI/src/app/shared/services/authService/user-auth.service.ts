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

  public clear() {
    this._cookie.deleteAll();
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
