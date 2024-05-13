import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { User } from 'app/shared/models/users/user';
import { UserService } from 'app/shared/services/userService/user.service';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default
})
export class DashboardComponent implements OnInit {

  authenticatedUser: User;

  authenticatedUserId: string;

  constructor(
    private _apiUser: UserService,
    private _cookieService:  CookieService
  ) { }

  ngOnInit(): void {
    this.authenticatedUserId = this._cookieService.get('id');

    this.getAuthenticatedUser(this.authenticatedUserId);
  }

  getAuthenticatedUser(id: string): void {
    this._apiUser.getUser(id).subscribe({
      next:(result) => {
        this.authenticatedUser = result;
      }
    });
  }


}
