import { Component, OnInit, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FuseCardComponent } from '@fuse/components/card';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Patient } from 'app/shared/models/users/patient/patient';
import { UserService } from 'app/shared/services/userService/user.service';

@Component({
  selector: 'app-patient-add',
  templateUrl: './patient-add.component.html',
  styles: [
    `
        cards fuse-card {
            margin: 16px;
        }
    `
  ]
})
export class PatientAddComponent implements OnInit {

  formFieldHelpers: string[] = [''];

  patients: Observable<Patient[]>;

  patient: Patient = new Patient();
  submitted = false;
  selectedImage: File | null = null;

  @ViewChildren(FuseCardComponent, { read: ElementRef }) private _fuseCards: QueryList<ElementRef>;


  constructor(
    private patientService: UserService,
    private router: Router,
    private _matDialogRef: MatDialogRef<PatientAddComponent>
  ) { }

  ngOnInit(): void {
  }

  saveUser() {
    this.patient.dateOfBirth = new Date(this.patient.dateOfBirth);
    this.patientService.createPatient(this.patient).subscribe({
      next: (data) => {
        console.log(data);
        this.onCloseClick();
        
      },
      error: (e) => {
        console.log(e);
      }
    });
  }

  onSubmit() {
    this.submitted = true;
    this.saveUser();
    this.gotoList();
  }

  onCloseClick(): void {
    this._matDialogRef.close();
  }

  gotoList() {
    this.router.navigate(['patient/list']);
  }

}
