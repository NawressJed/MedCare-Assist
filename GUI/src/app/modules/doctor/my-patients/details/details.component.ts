import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Patient } from 'app/shared/models/users/patient/patient';
import { UserService } from 'app/shared/services/userService/user.service';
import { AddComponent } from '../../medicalFile/add/add.component';
import { MedicalFileDetailsComponent } from '../../medicalFile/details/details.component';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { User } from 'app/shared/models/users/user';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { MedicalFile } from 'app/shared/models/medicalFile/medical-file';
import { MedicalFileService } from 'app/shared/services/medicalFileService/medical-file.service';
import { DetailsModule } from '../../medicalFile/details/details.module';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  patient: Patient;
  id: string;

  medicalFiles$: Observable<MedicalFile[]>;

  authenticatedUser: User;
  authenticatedUserId: string;

  constructor(
    private _apiUser: UserService,
    private _route: ActivatedRoute,
    private _matDialog: MatDialog,
    private _cookieService: CookieService,
    private _medicalFileService: MedicalFileService
  ) { }

  ngOnInit(): void {
    this.getAuthenticatedUser(this._cookieService.get('id'));

    this.id = this._route.snapshot.paramMap.get('id');

    this._apiUser.getPatient(this.id)
        .subscribe(data => {
          console.log(data);
          this.patient = data;
          this.loadMedicalFiles();
        });
  }

  addNewMedicalFile(): void {
    const dialogRef = this._matDialog.open(AddComponent, {
      autoFocus: false,
      data: {
        doctorId: this.authenticatedUserId, 
        patientId: this.id 
      }
    });
    dialogRef.afterClosed().subscribe(() => {
      this.loadMedicalFiles();
    });
  }

  getAuthenticatedUser(id: string): void {
    this._apiUser.getUser(id).subscribe({
      next: (result) => {
        this.authenticatedUser = result;
        this.authenticatedUserId = this.authenticatedUser.id; 
      }
    });
  }

  loadMedicalFiles(){
    this.medicalFiles$ = this._medicalFileService.getPatientMedicalFiles(this.id)
  }

  viewMedicalFile(medicalFileId: string): void {
    this._matDialog.open(MedicalFileDetailsComponent, {
      autoFocus: false,
      data: {
        medicalFileId
      }
    });
  }

}
