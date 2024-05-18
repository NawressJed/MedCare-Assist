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

  authenticatedUser: string;


  constructor(
    private _cookieService:  CookieService
  ) { }

  ngOnInit(): void {
    this.authenticatedUser = this._cookieService.get('firstname');
  }


}
