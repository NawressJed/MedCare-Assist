import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthenticationService } from '../authentication.service';
import { ForgetPassword } from '../forgetPassword';

@Component({
    selector: 'forgot-password-modern-reversed',
    templateUrl: './forgot-password.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class AuthForgotPasswordComponent implements OnInit {
    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: ''
    };
    forgotPasswordForm: FormGroup;
    showAlert: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder,
        private authService: AuthenticationService
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.forgotPasswordForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Send the reset link
     */
    sendResetLink(): void {
        if (this.forgotPasswordForm.valid) {
            const forgetPassword: ForgetPassword = {
                email: this.forgotPasswordForm.get('email').value,
              };
              this.authService.forgetPassword(forgetPassword).subscribe(
                () => {
                    this.showAlert = true;
                    this.alert = {
                        type: 'success',
                        message: 'Reset link sent successfully. Please check your email.'
                    };
                },
                (error) => {
                    console.error("Error", error)
                    this.showAlert = true;
                    this.alert = {
                        type: 'error',
                        message: 'Failed to send reset link. Please try again later.'
                    };
                }
            );
        }
    }
}
