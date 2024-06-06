import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { BooleanInput } from '@angular/cdk/coercion';
import { Subject, takeUntil } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { UserAuthService } from 'app/shared/services/authService/user-auth.service';
import { AuthenticationService } from 'app/shared/services/authService/authentication.service';
import { TokenService } from 'app/shared/services/tokenService/token.service';

@Component({
    selector: 'user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'user'
})
export class UserComponent implements OnInit, OnDestroy {
    /* eslint-disable @typescript-eslint/naming-convention */
    static ngAcceptInputType_showAvatar: BooleanInput;
    /* eslint-enable @typescript-eslint/naming-convention */

    @Input() showAvatar: boolean = true;
    name: string;
    lastname: string;
    initialisms: string;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _tokenService: TokenService,
        private authService: AuthenticationService,
        private _cookieService: CookieService
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.name = this._cookieService.get('name');
        this.lastname = this._cookieService.get('lastname')

        this.initialisms = this.getFirstLetters(this.name.toUpperCase().trim());
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------


    /**
     * Sign out
     */
    signOut(): void {
        const refreshToken = this._tokenService.getRefreshToken();
    
        this.authService.logout(refreshToken).subscribe(
            response => {
                console.log('Logout successful');
                this._router.navigate(['/sign-out']);
            },
            error => {
                console.error('Error logging out:', error);
            }
        );
    }
    
    

    getFirstLetters(str): string {
        let firstLetters = str
            .split(' ')
            .map(word => word[0])
            .join('.');
        if (firstLetters.charAt(firstLetters.length - 1) === '.') {
            firstLetters = firstLetters.slice(0, -1);
        }
        return firstLetters;
    }
}
