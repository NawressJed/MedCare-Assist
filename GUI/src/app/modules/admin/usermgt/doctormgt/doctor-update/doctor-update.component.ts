import { Component, OnInit, ElementRef, Inject, ChangeDetectorRef } from '@angular/core';
import { DoctorService } from '../../../../../shared/services/admin/doctorService/doctor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Doctor } from 'app/shared/models/users/doctor/doctor';

@Component({
  selector: 'app-doctor-update',
  templateUrl: './doctor-update.component.html',
  styles: [
    `
        cards fuse-card {
            margin: 16px;
        }
    `
  ]
})
export class DoctorUpdateComponent implements OnInit {

  doctor: Doctor;

  constructor(
    private doctorService: DoctorService,
    private router: Router,
    private _matDialogRef: MatDialogRef<DoctorUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { doctor: Doctor },
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.doctor = this.data.doctor;
  
    setTimeout(() => {
      this.doctorService.getDoctor(this.doctor)
        .subscribe(data => {
          console.log(data);
          this.doctor = data;
          this.cdr.detectChanges();
        }, error => console.log(error));
    });
  }  

  updateDoctor() {
    this.doctorService.updateDoctor(this.doctor.id, this.doctor)
      .subscribe(data => {
        console.log(data);
        this.doctor = new Doctor();
        this.onCloseClick();
        this.gotoList();
      }, error => console.log(error));
  }


  onSubmit() {
    this.updateDoctor();
  }

  gotoList() {
    this.router.navigate(['doctor/list']);
  }

  onCloseClick(): void {
    this._matDialogRef.close();
  }

}
