import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { AuthenticationService } from '../authentication.service';
import { User } from '../user';

@Component({
    selector: 'auth-sign-in',
    templateUrl: './sign-in.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class AuthSignInComponent implements OnInit {
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: ''
    };
    signInForm: FormGroup;
    showAlert: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthenticationService,
        private _formBuilder: FormBuilder,
        private _router: Router
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
        this.signInForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            rememberMe: ['']
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in
     */
    /**
 * Sign in
 */
    signIn(): void {
        if (this.signInForm.invalid) {
            return;
        }
    
        // Disable the form
        this.signInForm.disable();
    
        // Hide the alert
        this.showAlert = false;
    
        // Sign in
        this._authService.signIn(this.signInForm.value)
            .subscribe(
                (response: any) => {
                    if (response && response.role) {
                        switch (response.role) {
                            case 'DOCTOR':
                                console.log("Jawna behi");
                                this._router.navigateByUrl('/admin/patient/list');
                                break;
                            default:
                                console.error("Sorry not a DOCTOR", response.role);
                                // Handle redirection for other roles or display a message
                                break;
                        }
                    } else {
                        console.error("Oh lala!");
                        // Handle redirection for cases where role is missing
                    }
                },
                (error) => {
                    // Re-enable the form
                    this.signInForm.enable();
    
                    // Reset the form
                    this.signInNgForm.resetForm();
    
                    // Set the alert
                    this.alert = {
                        type: 'error',
                        message: 'Wrong email or password'
                    };
    
                    // Show the alert
                    this.showAlert = true;
                }
            );
    }    
}




