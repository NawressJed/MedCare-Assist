import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { User } from 'app/shared/models/user/user.model';
import { CognitoService } from 'app/shared/services/cognito/cognito.service';
import { UserService } from 'app/shared/services/collaborators/user.service';
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

  constructor(private _apiUser: UserService,
            private _cognitoService: CognitoService ) { }

  ngOnInit(): void {
    this.authenticatedUserId = this._cognitoService.getValueFromStorage('ID');

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
