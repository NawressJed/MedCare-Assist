import { Component, OnInit, ElementRef, Inject, ChangeDetectorRef } from '@angular/core';
import { Patient } from '../patient';
import { PatientService } from '../patient.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-patient-update',
  templateUrl: './patient-update.component.html',
  styles: [
    `
        cards fuse-card {
            margin: 16px;
        }
    `
  ]
})
export class PatientUpdateComponent implements OnInit {

  patient: Patient;

  constructor(
    private patientService: PatientService,
    private router: Router,
    private _matDialogRef: MatDialogRef<PatientUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { patient: Patient },
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.patient = this.data.patient;
  
    setTimeout(() => {
      this.patientService.getPatient(this.patient)
        .subscribe(data => {
          console.log(data);
          this.patient = data;
          this.cdr.detectChanges(); // Trigger change detection
        }, error => console.log(error));
    });
  }  

  updatePatient() {
    this.patientService.updatePatient(this.patient.id, this.patient)
      .subscribe(data => {
        console.log(data);
        this.patient = new Patient();
        this.onCloseClick();
        this.gotoList();
      }, error => console.log(error));
  }


  onSubmit() {
    this.updatePatient();
  }

  gotoList() {
    this.router.navigate(['patient/list']);
  }

  onCloseClick(): void {
    this._matDialogRef.close();
  }
}
