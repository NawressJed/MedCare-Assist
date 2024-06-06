import { Component, ElementRef, Inject, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { FuseCardComponent } from '@fuse/components/card';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { TranslateService } from '@ngx-translate/core';
import { CanComponentDeactivate } from 'app/can-deactivate-guard.service';
import { MedicalFile } from 'app/shared/models/medicalFile/medical-file';
import { MedicalFileService } from 'app/shared/services/medicalFileService/medical-file.service';
import { UserService } from 'app/shared/services/userService/user.service';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styles: [
    `
input[type="time"]::-webkit-calendar-picker-indicator {
    display: none;
}

        cards fuse-card {
            margin: 16px;
        }
    `
  ],
})
export class AddComponent implements OnInit {

  submitted = false;

  formFieldHelpers: string[] = [''];

  medicalFileForm: FormGroup;
  severities: string[] = ['MILD', 'MODERATE', 'SEVERE', 'CRITICAL'];
  medicationDurations: string[] = ['1 day', '1 week', '1 month'];

  @ViewChildren(FuseCardComponent, { read: ElementRef }) private _fuseCards: QueryList<ElementRef>;

  constructor(
    private _userService: UserService,
    private medicalFileService: MedicalFileService,
    private route: ActivatedRoute,
    private _matDialogRef: MatDialogRef<AddComponent>,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { doctorId: string; patientId: string }
  ) { }

  ngOnInit(): void {
    this.medicalFileForm = this._formBuilder.group({
      disease: ['', Validators.required],
      description: ['', Validators.required],
      severity: ['MILD'],
      medications: this._formBuilder.array([this.createMedication()])
    });
  }

  createMedication(): FormGroup {
    return this._formBuilder.group({
      name: ['', Validators.required],
      dosage: ['', Validators.required],
      frequency: ['', Validators.required],
      duration: ['', Validators.required],
    });
  }

  addMedication(): void {
    const medications = this.medicalFileForm.get('medications') as FormArray;
    medications.push(this.createMedication());
  }

  removeMedication(index: number): void {
    const medications = this.medicalFileForm.get('medications') as FormArray;
    medications.removeAt(index);
  }

  trackByFn(index: any): any {
    return index;
  }

  onCloseClick(): void {
    this._matDialogRef.close();
  }

  /**
     * Set the task priority
     *
     * @param severity
     */
  setSeverity(severity): void {
    this.medicalFileForm.get('severity').setValue(severity);
  }

  onSubmit() {
    this.submitted = true;
    console.log('Form submitted:', this.medicalFileForm.value);

    if (this.medicalFileForm.valid) {
        console.log('Form is valid. Submitting...');
        const medicalFileData = this.medicalFileForm.value;
        const { doctorId, patientId } = this.data;

        this.medicalFileService.createPatientMedicalFile(doctorId, patientId, medicalFileData).subscribe({
            next: (res) => {
                console.log('Medical file created successfully:', res);
                this._matDialogRef.close(res);
            },
            error: (err) => {
                console.error('Error creating medical file:', err);
            }
        });
    } else {
        console.log('Form is invalid.');
        this.logFormErrors(this.medicalFileForm);
    }
}

logFormErrors(group: FormGroup): void {
    Object.keys(group.controls).forEach((key: string) => {
        const control = group.get(key);
        if (control instanceof FormControl) {
            if (control.errors) {
                console.log('Control:', key, 'Errors:', control.errors);
            }
        } else if (control instanceof FormGroup) {
            this.logFormErrors(control);
        } else if (control instanceof FormArray) {
            control.controls.forEach((control, index) => {
                console.log(`FormArray: ${key}, Index: ${index}`);
                this.logFormErrors(control as FormGroup);
            });
        }
    });
}

}
