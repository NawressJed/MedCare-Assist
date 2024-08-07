import { Location } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { switchMap, debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { UserService } from 'app/shared/services/userService/user.service';
import { CookieService } from 'ngx-cookie-service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Patient } from 'app/shared/models/users/patient/patient';
import { User } from 'app/shared/models/users/user';
import { CanComponentDeactivate } from 'app/can-deactivate-guard.service';
import { Error } from 'app/shared/models/Error/Error';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddComponent implements OnInit, AfterViewInit {

  searchForm: FormGroup;
  searchControl: FormControl;
  filteredPatients$: Observable<Patient[]>;

  disableSelectManager = true;
  disableSelectBusinessUnit = true;
  clicked = false;
  identityRoles: string[];
  verticalStepperForm: FormGroup;
  addPatientForm: FormGroup;
  createUserForm: Observable<User>;
  managers: Observable<User[]>;
  selectedNullManagerBusinessUnitLeader: User;
  errors: Error[] = [];
  disableButton = false;
  isChecked = false;
  authenticatedUser: User;
  authenticatedUserId: string;
  configForm: FormGroup;
  leavePageForm = this._formBuilder.group({
    title: this.translate.instant('NAVIGATION.CONFIRM_LEAVE'),
    message: this.translate.instant('NAVIGATION.CONFIRM_LEAVE_MESSAGE'),
    icon: this._formBuilder.group({
      show: true,
      name: 'heroicons_outline:exclamation',
      color: 'warn'
    }),
    actions: this._formBuilder.group({
      confirm: this._formBuilder.group({
        show: true,
        label: this.translate.instant('NAVIGATION.CONFIRM'),
        color: 'warn',
      }),
      cancel: this._formBuilder.group({
        show: true,
        label: this.translate.instant('NAVIGATION.CANCEL'),
      })
    }),
    dismissible: true
  });
  buttonClicked = false;

  showSuccessAlert = false;
  showErrorAlert = false;

  constructor(private _formBuilder: FormBuilder,
              private apiUser: UserService,
              private router: Router,
              private _location: Location,
              private _fuseConfirmationService: FuseConfirmationService,
              public translate: TranslateService,
              private _cookieService: CookieService,
              private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getAuthenticatedUser(this._cookieService.get('id'));

    const regExpPhone = new RegExp(/^(\+216\d{8}|0\d{8})$/);
    const regExpEmail = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
    const regExpZipCode = new RegExp(/[0-9]{4}/g);
    const regExpDate = new RegExp(/^\d{4}-\d{2}-\d{2}$/);

    this.addPatientForm = this._formBuilder.group({
      step1: this._formBuilder.group({
        firstname: ['', Validators.required],
        lastname: ['', Validators.required],
        dateOfBirth: ['', [Validators.required, Validators.pattern(regExpDate)]],
        gender: ['', Validators.required],
        phoneNumber: ['', [Validators.required, Validators.pattern(regExpPhone)]],
        email: ['', [Validators.required, Validators.pattern(regExpEmail)]],
      }),
      step2: this._formBuilder.group({
        address: ['', Validators.required],
        zipCode: ['', [Validators.required, Validators.pattern(regExpZipCode)]]
      })
    });

    this.searchControl = new FormControl('', [Validators.required, Validators.email]);

    this.filteredPatients$ = this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(email => {
        if (email) {
          return this.apiUser.searchPatientsByEmail(email);
        } else {
          return of([]);
        }
      })
    );
  }

  getAuthenticatedUser(id: string): void {
    this.apiUser.getUser(id).subscribe({
      next: (result) => {
        this.authenticatedUser = result;
        this.authenticatedUserId = this.authenticatedUser.id; 
      }
    });
  }

  goBack(): void {
    this._location.back();
  }

  ngAfterViewInit(): void { }

  onEmailInput(): void {
    this.cdr.detectChanges();
  }

  toggleCDI(event: MatCheckboxChange): void {
    if (event.checked) {
      this.isChecked = true;
      this.addPatientForm.get('step2').get('endContractDate').setValue(null);
    }
    else {
      this.isChecked = false;
    }
  }

  addPatientToDoctor(patient: Patient): void {
    if (this.authenticatedUserId) {
      this.apiUser.addPatientToDoctor(this.authenticatedUserId, patient.id).subscribe({
        next: (response) => {
          console.log('Patient added successfully', response);
          this.showSuccessAlert = true;
          this.showErrorAlert = false;
          this.cdr.detectChanges();
          setTimeout(() => {
            this.showSuccessAlert = false;
            this.buttonClicked = true;
            this.router.navigateByUrl('/doctor/my-patients/list');
          }, 2000);
          this.clicked = true;
        },
        error: (error) => {
          console.error('Error adding patient to doctor', error);
          this.showSuccessAlert = false;
          this.showErrorAlert = true;
          this.cdr.detectChanges();
        }
      });
    }
  }

  addPatient(): void {
    const email = this.searchControl.value;
    this.filteredPatients$.subscribe(patients => {
      const patient = patients.find(p => p.email === email);
      if (patient) {
        this.addPatientToDoctor(patient);
      } else {
        console.error('No patient found with this email');
        this.showSuccessAlert = false;
        this.showErrorAlert = true;
        this.cdr.detectChanges();
      }
    });
  }

  createUser(): void {
    this.errors = [];
    if (this.addPatientForm.valid) {
      const data = { ...this.addPatientForm.value.step1, ...this.addPatientForm.value.step2 } as Patient;
      data.firstname = data.firstname.trim();
      data.lastname = data.lastname.trim();
      data.address = data.address.trim();
      data.zipCode = data.zipCode.trim();
      data.email = data.email.trim();
      data.gender = data.gender.trim();
      this.disableButton = true;
      console.log('Creating patient with data:', data);
      this.apiUser.createPatientToDoctor(this._cookieService.get('id'), data).subscribe({
        next: (r) => {
          console.log('Patient created successfully:', r);
          window.scrollTo(0, 0);
          this.showSuccessAlert = true;
          this.showErrorAlert = false;
          this.cdr.detectChanges();
          setTimeout(() => {
            this.showSuccessAlert = false;
            this.buttonClicked = true;
            this.router.navigateByUrl('/doctor/my-patients/list');
          }, 2000);
          this.clicked = true;
        },
        error: (e) => {
          this.disableButton = false;
          if (e.error && e.error.errors) {
            for (const error of e.error.errors) {
              this.errors.push(error);
            }
          } else {
            this.errors.push(new Error(null, this.translate.instant('ERROR_500')));
          }
          this.showSuccessAlert = false;
          this.showErrorAlert = true;
          this.cdr.detectChanges();
          window.scrollTo(0, 0);
        }
      });
    }
  }

  reset(): void {
    this.searchForm.reset(this.searchForm);
  }

  canDeactivate(component: CanComponentDeactivate,
                route: ActivatedRouteSnapshot,
                state: RouterStateSnapshot,
                nextState: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.buttonClicked) {
      const dialogRef = this._fuseConfirmationService.open(this.leavePageForm.value);
      return dialogRef.afterClosed().pipe(map(result => result === 'confirmed' ? true : false));
    }
    return true;
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
