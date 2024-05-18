import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthenticationService } from '../../../shared/services/authService/authentication.service';
import { Patient } from 'app/shared/models/users/patient/patient';
import { Doctor } from 'app/shared/models/users/doctor/doctor';

@Component({
    selector: 'auth-sign-up',
    templateUrl: './sign-up.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class AuthSignUpComponent implements OnInit {
    @ViewChild('signUpNgForm') signUpNgForm: NgForm;
    @ViewChild(MatTabGroup) tabGroup: MatTabGroup;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: ''
    };
    patientSignUpForm: FormGroup;
    doctorSignUpForm: FormGroup;
    showAlert: boolean = false;
    patient: Patient = new Patient();
    doctor: Doctor = new Doctor();
    formFieldHelpers: string[] = [''];
    private currentTabIndex = 0;

    constructor(
        private authService: AuthenticationService,
        private _formBuilder: FormBuilder,
        private _router: Router
    ) {}

    ngOnInit(): void {
        this.patientSignUpForm = this._formBuilder.group({
            firstname: ['', Validators.required],
            lastname: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            gender: ['', Validators.required],
            phoneNumber: ['', Validators.required],
            address: ['', Validators.required],
            zipCode: ['', Validators.required],
            dateOfBirth: ['', Validators.required]
        });

        this.doctorSignUpForm = this._formBuilder.group({
            firstname: ['', Validators.required],
            lastname: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            gender: ['', Validators.required],
            phoneNumber: ['', Validators.required],
            workPhoneNumber: ['', Validators.required],
            address: ['', Validators.required],
            zipCode: ['', Validators.required],
            consultationPrice: ['', Validators.required],
            specialty: ['', Validators.required]
        });
    }

    signUp(): void {
        console.log(this.tabGroup.selectedIndex)
        let signUpForm = this.tabGroup.selectedIndex === 0 ? this.patientSignUpForm : this.doctorSignUpForm;

        if (signUpForm.invalid) {
            console.log(signUpForm)
            return;
        }

        signUpForm.disable();
        this.showAlert = false;

        const formData = signUpForm.value;

        console.log(this.tabGroup.selectedIndex)
        if (this.tabGroup.selectedIndex === 0) {
            this.patient.dateOfBirth = new Date(this.patient.dateOfBirth);
            this.authService.patientRegister(formData).subscribe(
                () => {
                    this._router.navigateByUrl('/confirmation-required');
                },
                () => {
                    this.handleSignUpError(signUpForm);
                }
            );
        } else if (this.tabGroup.selectedIndex === 1) {
            this.authService.doctorRegister(formData).subscribe(
                () => {
                    this._router.navigateByUrl('/confirmation-required');
                },
                () => {
                    this.handleSignUpError(signUpForm);
                }
            );
        }
    }

    private handleSignUpError(form: FormGroup): void {
        form.enable();


        this.signUpNgForm.resetForm();
        this.alert = {
            type: 'error',
            message: 'Something went wrong, please try again.'
        };
        this.showAlert = true;
    }

    public onSelectedIndexChange(tabIndex: number) {
        this.currentTabIndex = tabIndex;
    }

    onTabChange(event: MatTabChangeEvent): void {
        console.log('Tab index changed:', event.index);
    }
}
