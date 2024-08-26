import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { User } from 'app/shared/models/users/user';
import { UserService } from 'app/shared/services/userService/user.service';
import { CookieService } from 'ngx-cookie-service';
@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class DashboardComponent implements OnInit {
    authenticatedUser: User;

    authenticatedUserId: string;

    healthTips = [
      {
        title: 'Understanding Diabetes and Managing It',
        summary: 'Learn the basics of diabetes, types, and how to effectively manage your condition.',
        link: 'https://healthblog.com/diabetes-management',
        imageUrl: 'assets/images/diabile.jpg'
      },
      {
        title: 'Heart Healthy Exercises',
        summary: 'Discover exercises that help maintain cardiovascular health and improve heart strength.',
        link: 'https://healthblog.com/heart-exercises',
        imageUrl: 'assets/images/cardio.jpg'
      },
      {
        title: 'Eating for Your Age',
        summary: 'Nutritional needs change as you age. Find out what is best for your current stage of life.',
        link: 'https://healthblog.com/eating-for-age',
        imageUrl: 'assets/images/nutrition.jpg'
      }
    ];

    constructor(
        private _apiUser: UserService,
        private _cookie: CookieService
    ) {}

    ngOnInit(): void {
        this.authenticatedUserId = this._cookie.get('id');

        this.getAuthenticatedUser(this.authenticatedUserId);
    }

    getAuthenticatedUser(id: string): void {
        this._apiUser.getUser(id).subscribe({
            next: (result) => {
                this.authenticatedUser = result;
            },
        });
    }
}
