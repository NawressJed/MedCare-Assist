import { Component, OnInit, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FuseCardComponent } from '@fuse/components/card';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Doctor } from 'app/shared/models/users/doctor/doctor';
import { UserService } from 'app/shared/services/userService/user.service';

@Component({
  selector: 'app-doctor-add',
  templateUrl: './doctor-add.component.html',
  styles: [
    `
        cards fuse-card {
            margin: 16px;
        }
    `
  ]
})
export class DoctorAddComponent implements OnInit {

  formFieldHelpers: string[] = [''];

  doctors: Observable<Doctor[]>;

  doctor: Doctor = new Doctor();
  submitted = false;
  selectedImage: File | null = null;

  @ViewChildren(FuseCardComponent, { read: ElementRef }) private _fuseCards: QueryList<ElementRef>;
  


  constructor(
    private userService: UserService,
    private router: Router,
    private _matDialogRef: MatDialogRef<DoctorAddComponent>
  ) { }

  ngOnInit(): void {
  }

  saveUser() {
    this.userService.createDoctor(this.doctor).subscribe({
      next: (data) => {
        console.log(data);
        this.onCloseClick();
        this.gotoList();
      },
      error: (e) => {
        console.log(e);
      }
    });
  }

  onSubmit() {
    this.submitted = true;
    this.saveUser();
  }

  onCloseClick(): void {
    this._matDialogRef.close();
  }

  gotoList() {
    this.router.navigate(['admin/doctor/list']);
  }


}
