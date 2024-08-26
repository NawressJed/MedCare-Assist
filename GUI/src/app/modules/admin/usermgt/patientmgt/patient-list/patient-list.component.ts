import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DOCUMENT, DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { filter, fromEvent, Observable, Subject, switchMap, BehaviorSubject, takeUntil } from 'rxjs';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { PatientAddComponent } from '../patient-add/patient-add.component';
import { PatientUpdateComponent } from '../patient-update/patient-update.component';
import { Patient } from 'app/shared/models/users/patient/patient';
import { UserService } from 'app/shared/services/userService/user.service';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
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
        grid-template-columns: 48px 200px 230px 180px 250px 180px 200px auto 72px;
      }
  }
  
  .action-column {
      justify-content: center;
  }
    `
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PatientListComponent implements OnInit {


  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;

  patientsCount: number = 0;
  patients: Observable<Patient[]>;
  contactsTableColumns: string[] = ['name', 'email', 'phoneNumber', 'job'];
  drawerMode: 'side' | 'over';
  searchInputControl: FormControl = new FormControl();
  selectedPatient: Patient;
  filter$: BehaviorSubject<string> = new BehaviorSubject('patients');
  searchQuery$: BehaviorSubject<string> = new BehaviorSubject(null);
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Constructor
   */
  constructor(
    private _fuseConfirmationService: FuseConfirmationService,
    private patientService: UserService,
    private _activatedRoute: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef,
    @Inject(DOCUMENT) private _document: any,
    private _router: Router,
    private _matDialog: MatDialog,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private datePipe: DatePipe
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
    this.patients = this.patientService.getPatientsList();
    this.patients.pipe(
      takeUntil(this._unsubscribeAll)
    ).subscribe((patients: Patient[]) => {
      this.patientsCount = patients.length;
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
    this.filter$.next('patients');
  }

  addNewPatient(): void {
    const dialog = this._matDialog.open(PatientAddComponent, {
      autoFocus: false,
      data: {
      }
    });
    dialog.afterClosed().subscribe(() => {
      this.reloadData();
    });
  }

  updatePatient(patient: Patient): void {
    if (patient && patient.id) {
      const dialog = this._matDialog.open(PatientUpdateComponent, {
        autoFocus: false,
        data: { patient: patient } // Pass patient object here
      });

      dialog.afterClosed().subscribe(() => {
        this.reloadData();
      });
    } else {
      console.error('Patient ID is undefined.');
    }
  }

  deletePatient(patient: Patient): void {
    console.log("Patient to be deleted:", patient);

    // Open the confirmation dialog
    const confirmation = this._fuseConfirmationService.open({
      title: 'Delete Patient',
      message: 'Are you sure you want to remove this patient? This action cannot be undone!',
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
        this.patientService.deleteUser(patient).subscribe(
          () => {
            console.log('Patient deleted successfully.');
            this.reloadData(); // Reload data after deletion
          },
          (error) => {
            console.error('Error deleting patient:', error);
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
  trackByFn(index: number, patient: Patient): any {
    return patient.id || index;
  }

  convertDateFormat(dateString: string): string {
    const parsedDate = new Date(dateString);
    return this.datePipe.transform(parsedDate, 'dd/MM/yyyy'); // Format date as dd/mm/yyyy
  }

}
