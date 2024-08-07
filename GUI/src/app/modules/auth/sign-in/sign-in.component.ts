import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthenticationService } from '../../../shared/services/authService/authentication.service';
import { UserAuthService } from 'app/shared/services/authService/user-auth.service';
import { User } from 'app/shared/models/users/user';

declare var particlesJS: any;

@Component({
    selector: 'auth-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class AuthSignInComponent implements AfterViewInit {
    @ViewChild('particlesJs', { static: true }) particlesJs: ElementRef;
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: ''
    };
    signInForm: FormGroup;
    showAlert: boolean = false;
    user: User = new User;

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthenticationService,
        private _userAuthService: UserAuthService,
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

    ngAfterViewInit(): void {
        console.log(this.particlesJs); // Check if the element is correctly captured
        if (this.particlesJs) {
            particlesJS.load(this.particlesJs.nativeElement.id, 'assets/particlesjs-config.json', () => {
                console.log('callback - particles.js config loaded');
            });
        } else {
            console.log('Particles element not found');
        }
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

        this._authService.signIn(this.signInForm.value).subscribe(
            (response: any) => {

                const role = response.user.role;
                if(role === "ADMIN") {
                    this._router.navigateByUrl('/admin');
                }else if(role === "ROLE_DOCTOR") {
                    this._router.navigateByUrl('/doctor/appointment/list');
                }else {
                    this._router.navigateByUrl('/patient/appointment/doctors')
                }
            },
            (error) => {
                console.log(error)

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
        )
    }

    /*public signIn(): void {
        // Return if the form is invalid
        if (this.signInForm.valid) {
            return;
        }

        // Disable the form
        this.signInForm.disable();

        // Hide the alert
        this.showAlert = false;
        this._authService.signIn(this.signInForm.value).subscribe(
            (response) => {
                this._userAuthService.setRole(response.user.role)
                this._userAuthService.setEmail(response.user.email)
                this._userAuthService.setRefreshToken(response.refreshToken)
                this._userAuthService.setAccessToken(response.accessToken)

                const role = response.role;
                if(role === "ADMIN") {
                    this._router.navigateByUrl('/admin');
                }else if(role === "DOCTOR") {
                    this._router.navigateByUrl('/doctor');
                }else {
                    this._router.navigateByUrl('/patient')
                }
            },
            (e) => {
            console.log(e);
            // Re-enable the form
            this.signInForm.enable();

            // Reset the form
            this.signInNgForm.resetForm();

            // Set the alert
            this.alert = {
                type: 'error',
                message: 'Email et/ou mot de passe incorrect(s)'
            };

            // Show the alert
            this.showAlert = true;
        });
    }
    /*signIn(): void {
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
                                break;
                        }
                    } else {
                        console.error("Oh lala!");
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
    } */   
}




