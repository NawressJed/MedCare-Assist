import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthenticationService } from '../../../shared/services/authService/authentication.service';
import { Patient } from 'app/shared/models/users/patient/patient';
import { Doctor } from 'app/shared/models/users/doctor/doctor';

declare var particlesJS: any;

@Component({
    selector: 'auth-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class AuthSignUpComponent implements AfterViewInit {
    @ViewChild('particlesJs', { static: true }) particlesJs: ElementRef;
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
    ) { }

    ngOnInit(): void {

        this.patientSignUpForm = this._formBuilder.group({
            step1: this._formBuilder.group({
                firstname: ['', Validators.required],
                lastname: ['', Validators.required],
                dateOfBirth: ['', Validators.required],
                gender: ['', Validators.required]
            }),
            step2: this._formBuilder.group({
                phoneNumber: ['', Validators.required],
                email: ['', [Validators.required, Validators.email]],
                password: ['', Validators.required]
            }),
            step3: this._formBuilder.group({
                address: ['', Validators.required],
                zipCode: ['', Validators.required]
            })
        });

        this.doctorSignUpForm = this._formBuilder.group({
            step1: this._formBuilder.group({
                firstname: ['', Validators.required],
                lastname: ['', Validators.required],
                gender: ['', Validators.required],
                specialty: ['', Validators.required],
                consultationPrice: ['', Validators.required],
            }),
            step2: this._formBuilder.group({
                phoneNumber: ['', Validators.required],
                workPhoneNumber: ['', Validators.required],
                email: ['', [Validators.required, Validators.email]],
                password: ['', Validators.required]
            }),
            step3: this._formBuilder.group({
                address: ['', Validators.required],
                zipCode: ['', Validators.required]
            })
        });
    }

    ngAfterViewInit(): void {
        console.log(this.particlesJs); 
        if (this.particlesJs) {
            particlesJS.load(this.particlesJs.nativeElement.id, 'assets/particlesjs-config.json', () => {
                console.log('callback - particles.js config loaded');
            });
        } else {
            console.log('Particles element not found');
        }
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
            const data = { ...this.patientSignUpForm.value.step1, ...this.patientSignUpForm.value.step2, ...this.patientSignUpForm.value.step3 } as Patient;
            data.firstname = data.firstname.trim();
            data.lastname = data.lastname.trim();
            data.address = data.address.trim();
            data.zipCode = data.zipCode.trim();
            data.email = data.email.trim();
            data.gender = data.gender.trim();
            this.authService.patientRegister(data).subscribe(
                () => {
                    this._router.navigateByUrl('/confirmation-required');
                },
                () => {
                    this.handleSignUpError(signUpForm);
                }
            );
        } else if (this.tabGroup.selectedIndex === 1) {
            const data = { ...this.doctorSignUpForm.value.step1, ...this.doctorSignUpForm.value.step2, ...this.doctorSignUpForm.value.step3 } as Doctor;
            data.firstname = data.firstname.trim();
            data.lastname = data.lastname.trim();
            data.address = data.address.trim();
            data.zipCode = data.zipCode.trim();
            data.email = data.email.trim();
            data.gender = data.gender.trim();
            data.specialty = data.specialty.trim();
            this.authService.doctorRegister(data).subscribe(
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
