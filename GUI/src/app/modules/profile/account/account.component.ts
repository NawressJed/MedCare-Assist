import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { FuseAlertComponent } from '@fuse/components/alert';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { TranslateService } from '@ngx-translate/core';
import { CanComponentDeactivate } from 'app/can-deactivate-guard.service';
import { Error } from 'app/shared/models/Error/Error';
import { AuthenticationService } from 'app/shared/services/authService/authentication.service';
import { UserService } from 'app/shared/services/userService/user.service';
import { CookieService } from 'ngx-cookie-service';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'settings-account',
  templateUrl: './account.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsAccountComponent implements OnInit {

  specialties: string[] = [
    'ANESTHESIOLOGIST', 'CARDIOLOGIST', 'DERMATOLOGIST', 'ENDOCRINOLOGIST',
    'FAMILY_PHYSICIAN', 'GASTROENTEROLOGIST', 'NEPHROLOGIST', 'NEUROLOGIST',
    'OPHTHALMOLOGIST', 'PEDIATRICIAN', 'RADIOLOGIST'
  ];

  user: any;
  role: string;
  accountForm: FormGroup;
  errors: Error[] = [];
  buttonClicked = false;

  regExpPhone = new RegExp(/^(\+216\d{8}|0\d{8})$/);
  regExpEmail = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
  regExpZipCode = new RegExp(/[0-9]{4}/g);
  regExpDate = new RegExp(/^\d{4}-\d{2}-\d{2}$/);

  @ViewChild('NameInput') input: ElementRef;
  @ViewChild('ErrorAlert') ErrorAlert: FuseAlertComponent;
  @ViewChild('SuccessAlert') SuccessAlert: FuseAlertComponent;

  constructor(
    private _formBuilder: FormBuilder,
    private _fuseConfirmationService: FuseConfirmationService,
    public translate: TranslateService,
    private api: UserService,
    private auth: AuthenticationService,
    private _cookieService: CookieService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.role = this._cookieService.get("role");
    this.getUser(this._cookieService.get("id"));
  }

  initializeForm(): void {
    this.accountForm = this._formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(this.regExpEmail)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(this.regExpPhone), Validators.minLength(8), Validators.maxLength(12)]],
      workPhoneNumber: ['', this.role === 'ROLE_DOCTOR' ? Validators.required: null],
      gender: ['', Validators.required],
      address: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern(this.regExpZipCode)]],
      specialty: ['', this.role === 'ROLE_DOCTOR' ? Validators.required: null],
      consultationPrice: ['', this.role === 'ROLE_DOCTOR' ? Validators.required: null],
      dateOfBirth: ['', this.role === 'ROLE_PATIENT' ? [Validators.required, Validators.pattern(this.regExpDate)]: null]
    });
  }

  getUser(id: string): void {
    if (this.role === 'ROLE_DOCTOR') {
      this.api.getDoctor(id).subscribe({
        next: (res) => {
          this.user = res;
          this.accountForm.patchValue({
            lastname: this.user.lastname,
            firstname: this.user.firstname,
            gender: this.user.gender,
            phoneNumber: this.user.phoneNumber,
            workPhoneNumber: this.user.workPhoneNumber,
            address: this.user.address,
            zipCode: this.user.zipCode,
            email: this.user.email,
            specialty: this.user.specialty,
            consultationPrice: this.user.consultationPrice,
          });
        },
        error: (err) => {
          console.error('Error fetching doctor data:', err);
        }
      });
    } else if (this.role === 'ROLE_PATIENT') {
      this.api.getPatient(id).subscribe({
        next: (res) => {
          this.user = res;
          this.accountForm.patchValue({
            lastname: this.user.lastname,
            firstname: this.user.firstname,
            dateOfBirth: this.user.dateOfBirth,
            gender: this.user.gender,
            phoneNumber: this.user.phoneNumber,
            address: this.user.address,
            zipCode: this.user.zipCode,
            email: this.user.email,
          });
        },
        error: (err) => {
          console.error('Error fetching patient data:', err);
        }
      });
    }
  }

  updateUser(): void {
    console.log('Update button clicked'); // Debug log
    this.errors = [];
    const data = { id: this._cookieService.get("id"), ...this.accountForm.value };

    // Trim whitespace from string fields
    data.firstname = data.firstname.trim();
    data.lastname = data.lastname.trim();
    data.email = data.email.trim();
    data.address = data.address.trim();
    data.zipCode = data.zipCode.trim();
    if (this.role === 'ROLE_DOCTOR') {
      data.specialty = data.specialty.trim();
    }

    if (this.accountForm.valid) {
      if (this.role === 'ROLE_DOCTOR') {
        this.auth.updateDoctor(data.id, data).subscribe({
          next: (res) => {
            console.log('Doctor data updated successfully', res);
            window.scrollTo(0, 0);
            this.ErrorAlert.dismiss();
            this.SuccessAlert.show();
            setTimeout(() => { this.SuccessAlert.dismiss(); this.buttonClicked = true; }, 2000);
          },
          error: (e) => {
            console.error('Update error:', e); // More detailed error logging
            if (e.status === 403) {
              console.error('Forbidden: You do not have permission to perform this action.');
            } else if (e.status === 400) {
              this.errors = e.error.errors;
              window.scrollTo(0, 0);
              this.SuccessAlert.dismiss();
              this.ErrorAlert.show();
            }
          }
        });
      }  else if (this.role === 'ROLE_PATIENT') {
        this.api.updatePatient(data.id, data).subscribe({
          next: () => {
            console.log('Patient data updated successfully'); // Debug log
            window.scrollTo(0, 0);
            this.ErrorAlert.dismiss();
            this.SuccessAlert.show();
            setTimeout(() => { this.SuccessAlert.dismiss(); this.buttonClicked = true; }, 2000);
          },
          error: (e) => {
            this.handleErrors(e);
          }
        });
      }
    } else {
      console.log('Form is invalid'); // Debug log
      this.logValidationErrors();
    }
  }

  logValidationErrors(): void {
    Object.keys(this.accountForm.controls).forEach(key => {
      const controlErrors = this.accountForm.get(key).errors;
      if (controlErrors) {
        Object.keys(controlErrors).forEach(errorKey => {
          console.log(`Key: ${key}, Error: ${errorKey}, Value:`, controlErrors[errorKey]);
        });
      }
    });
  }

  handleErrors(e: any): void {
    console.error('Update error', e);
    if (e.status === 400) {
      this.errors = e.error.errors;
      window.scrollTo(0, 0);
      this.SuccessAlert.dismiss();
      this.ErrorAlert.show();
    }
  }
}
