import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { filter, fromEvent, Observable, Subject, switchMap, BehaviorSubject, takeUntil } from 'rxjs';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { DoctorAddComponent } from '../doctor-add/doctor-add.component';
import { DoctorUpdateComponent } from '../doctor-update/doctor-update.component';
import { Doctor } from 'app/shared/models/users/doctor/doctor';
import { UserService } from 'app/shared/services/userService/user.service';

@Component({
  selector: 'app-doctor-list',
  templateUrl: './doctor-list.component.html',
  styles: [
    `
.inventory-grid {
    grid-template-columns: 48px auto 40px;

    @screen sm {
        grid-template-columns: 48px 112px 112px 112px 112px 112px 112px auto 72px;
    }

    @screen md {
        grid-template-columns: 48px 112px 112px 112px 112px 112px 112px auto 72px;
    }

    @screen lg {
      grid-template-columns: 48px 200px 230px 180px 250px 200px 200px auto 72px;
    }
}

.action-column {
    justify-content: center;
}
    `]
})
export class DoctorListComponent implements OnInit {

  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;

  doctorsCount: number = 0;
  doctors: Observable<Doctor[]>;
  contactsTableColumns: string[] = ['name', 'email', 'phoneNumber', 'job'];
  drawerMode: 'side' | 'over';
  searchInputControl: FormControl = new FormControl();
  selectedPdoctor: Doctor;
  filter$: BehaviorSubject<string> = new BehaviorSubject('doctors');
  searchQuery$: BehaviorSubject<string> = new BehaviorSubject(null);
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Constructor
   */
  constructor(
    private _fuseConfirmationService: FuseConfirmationService,
    private userService: UserService,
    private _activatedRoute: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef,
    @Inject(DOCUMENT) private _document: any,
    private _router: Router,
    private _matDialog: MatDialog,
    private _fuseMediaWatcherService: FuseMediaWatcherService
  ) {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.reloadData();
  }

  reloadData() {
    this.doctors = this.userService.getDoctorsList();
    this.doctors.pipe(
      takeUntil(this._unsubscribeAll)
    ).subscribe((doctors: Doctor[]) => {
      this.doctorsCount = doctors.length;
    });
  }
  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  filterByQuery(query: string): void {
    this.searchQuery$.next(query);
  }

  resetFilter(): void {
    this.filter$.next('doctors');
  }

  addNewDoctor(): void {
    const dialogRef = this._matDialog.open(DoctorAddComponent, {
      autoFocus: false,
      data: {
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.reloadData();
    });
  }

  updateDoctor(doctor: Doctor): void {
    if (doctor && doctor.id) {
      const dialogRef = this._matDialog.open(DoctorUpdateComponent, {
        autoFocus: false,
        data: { doctor: doctor }
      });

      dialogRef.afterClosed().subscribe(() => {
        this.reloadData();
      });
    } else {
      console.error('Doctor ID is undefined.');
    }
  }

  deleteDoctor(doctor: Doctor): void {
    console.log("Doctor to be deleted:", doctor);

    const confirmation = this._fuseConfirmationService.open({
      title: 'Delete Doctor',
      message: 'Are you sure you want to remove this doctor? This action cannot be undone!',
      actions: {
        confirm: {
          label: 'Delete'
        }
      }
    });

    // Subscribe to the confirmation dialog closed action
    confirmation.afterClosed().subscribe((result) => {
      // If the confirm button is pressed...
      if (result === 'confirmed') {
        this.userService.deleteUser(doctor).subscribe(
          () => {
            console.log('Doctor deleted successfully.');
            this.reloadData(); // Reload data after deletion
          },
          (error) => {
            console.error('Error deleting doctor:', error);
            // Handle error (e.g., show error message)
          }
        );
      }
    });
  }


  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * On backdrop clicked
   */
  onBackdropClicked(): void {
    // Go back to the list
    this._router.navigate(['./'], { relativeTo: this._activatedRoute });

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Track by function for ngFor loops
   *
   * @param index
   * @param item
   */
  trackByFn(index: number, doctor: Doctor): any {
    return doctor.id || index;
  }

}
