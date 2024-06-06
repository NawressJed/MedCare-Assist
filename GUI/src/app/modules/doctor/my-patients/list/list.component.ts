import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { Doctor } from 'app/shared/models/users/doctor/doctor';
import { UserService } from 'app/shared/services/userService/user.service';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable, Subject, combineLatest } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { AddComponent } from '../../medicalFile/add/add.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styles: [
    `
    .pin-icon {
      font-size: 3px; /* Adjust the font size as needed */
    }
    cards fuse-card {
      margin: 16px;
    }
    `
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent implements OnInit, OnDestroy {

  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;

  patientsCount: number = 0;
  dpatients: Observable<Doctor[]>;
  filteredPatients: Observable<Doctor[]>;
  drawerMode: 'side' | 'over';

  searchForm: FormGroup;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef,
    private _router: Router,
    private _userService: UserService,
    private datePipe: DatePipe,
    private _cookie: CookieService,
  ) { }

  ngOnInit(): void {
    this.searchFormInit();
    this.reloadData();
  }

  searchFormInit(): void {
    this.searchForm = new FormGroup({
      keywords: new FormControl(''),
    });
  }

  reloadData(): void {
    this.dpatients = this._userService.getDoctorPatientsList(this._cookie.get('id'));

    this.filteredPatients = combineLatest([
      this.dpatients,
      this.searchForm.get('keywords').valueChanges.pipe(startWith(''))
    ]).pipe(
      map(([patients, search]) => {
        console.log('Original patients array:', patients);
        // Reverse the order of the patients
        let sortedPatients = [...patients].reverse();
        console.log('Sorted patients array:', sortedPatients); 
        if (!search) {
          return sortedPatients;
        }
        const filtered = sortedPatients.filter(patient =>
          `${patient.firstname} ${patient.lastname}`.toLowerCase().includes(search.toLowerCase())
        );
        console.log('Filtered patients array:', filtered); 
        return filtered;
      })
    );

    this.dpatients.pipe(
      takeUntil(this._unsubscribeAll)
    ).subscribe((patients: Doctor[]) => {
      console.log('Doctor Patients:', patients);
      this.patientsCount = patients.length;
    });
  }

  filter(): void {
    this.searchForm.get('keywords').setValue(this.searchForm.get('keywords').value);
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  onBackdropClicked(): void {
    this._router.navigate(['./'], { relativeTo: this._activatedRoute });
    this._changeDetectorRef.markForCheck();
  }

  trackByFn(index: number, doctor: any): any {
    return doctor.id || index;
  }

  convertDateFormat(dateString: string): string {
    const parsedDate = new Date(dateString);
    return this.datePipe.transform(parsedDate, 'dd/MM/yyyy');
  }
}
