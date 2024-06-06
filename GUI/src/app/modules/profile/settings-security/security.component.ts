import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'app/shared/services/authService/authentication.service';
import { CookieService } from 'ngx-cookie-service';
import { FuseAlertComponent } from '@fuse/components/alert';
import { UpdatePassword } from 'app/shared/models/updatePassword/update-password';

@Component({
  selector: 'settings-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsSecurityComponent implements OnInit {
  @ViewChild('ErrorAlert') ErrorAlert: FuseAlertComponent;
  @ViewChild('SuccessAlert') SuccessAlert: FuseAlertComponent;

  securityForm: FormGroup;
  showSuccessAlert = false;
  showErrorAlert = false;
  errorMessage: string;

  constructor(
    private _formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private _cookieService: CookieService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.securityForm = this._formBuilder.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required]
    });
  }

  onChangePassword(): void {
    if (this.securityForm.invalid) {
      return;
    }

    const updatePassword: UpdatePassword = {
      oldPassword: this.securityForm.get('currentPassword').value,
      newPassword: this.securityForm.get('newPassword').value
    };

    const userId = this._cookieService.get('id'); 

    this.authService.changePassword(userId, updatePassword).subscribe({
      next: (response) => {
        this.showErrorAlert = false;
        this.showSuccessAlert = true;
        this.cdr.detectChanges();
        if (this.SuccessAlert) {
          this.SuccessAlert.show();
        }
        setTimeout(() => {
          if (this.SuccessAlert) {
            this.SuccessAlert.dismiss();
          }
        }, 3000); 
        this.securityForm.reset();
      },
      error: (error) => {
        console.error('Error changing password', error);
        this.showSuccessAlert = false;
        this.showErrorAlert = true;
        this.errorMessage = this.getErrorMessage(error);
        this.cdr.detectChanges();
        if (this.ErrorAlert) {
          this.ErrorAlert.show();
        }
        setTimeout(() => {
          if (this.ErrorAlert) {
            this.ErrorAlert.dismiss();
          }
        }, 3000);
      }
    });
  }

  onCancel(): void {
    this.securityForm.reset();
    this.showSuccessAlert = false;
    this.showErrorAlert = false;
  }

  private getErrorMessage(error: any): string {
    if (error.error && typeof error.error === 'object') {
      return JSON.stringify(error.error); 
    } else if (error.error && typeof error.error === 'string') {
      return error.error; 
    } else {
      return 'An unknown error occurred';
    }
  }
}
