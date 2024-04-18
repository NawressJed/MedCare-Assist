import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { FuseValidators } from '@fuse/validators';
import { AuthenticationService } from '../authentication.service';

@Component({
    selector: 'reset-password-modern-reversed',
    templateUrl: './reset-password.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class AuthResetPasswordComponent implements OnInit {
    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: ''
    };
    resetPasswordForm: FormGroup;
    token: string;
    showAlert: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthenticationService,
        private _formBuilder: FormBuilder
    ) { }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.token = params['token'];
          });

        this.resetPasswordForm = this._formBuilder.group({
            newPassword: ['', Validators.required],
            confirmPassword: ['', Validators.required]
        },
            {
                validators: FuseValidators.mustMatch('newPassword', 'confirmPassword')
            }
        );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Reset password
     */

    resetPassword(): void {
        const newPassword = this.resetPasswordForm.get('newPassword').value;
        const confirmPassword = this.resetPasswordForm.get('confirmPassword').value;

        const resetPasswordData = {
            newPassword: newPassword,
            confirmPassword: confirmPassword
        };

        this.authService.resetPassword(this.token, resetPasswordData).subscribe({
            next: (response) => {
                console.log("Password reset successfully");
                this.navigateToSignIn();
            },
            error: (error) => {
                console.log("Error resetting password:", error.error.message);
                this.showAlert = true;
                this.alert.type = 'error';
                this.alert.message = error.error.message;
            }
        });
        
    }

    navigateToSignIn(): void {
        console.log('Navigating to sign-in page');
        this.router.navigateByUrl('/sign-in');
    }

}
