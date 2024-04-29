import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DOCUMENT, DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { filter, fromEvent, Observable, Subject, switchMap, BehaviorSubject, takeUntil } from 'rxjs';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { AppointmentService } from '../../../../shared/services/admin/appointmentService/appointment.service';
import { AppointmentAddComponent } from '../appointment-add/appointment-add.component';
import { AppointmentUpdateComponent } from '../appointment-update/appointment-update.component';
import { Appointment } from 'app/shared/models/appointment/appointment';

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
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
      grid-template-columns: 48px 150px 150px 150px 150px 150px 150px 500px;
    }
}

.action-column {
    justify-content: center;
}
    `]
})
export class AppointmentListComponent implements OnInit {

  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;

  appointmentsCount: number = 0;
  appointments: Observable<Appointment[]>;
  contactsTableColumns: string[] = ['name', 'email', 'phoneNumber', 'job'];
  drawerMode: 'side' | 'over';
  searchInputControl: FormControl = new FormControl();
  selectedAppointment: Appointment;
  filter$: BehaviorSubject<string> = new BehaviorSubject('appointments');
  searchQuery$: BehaviorSubject<string> = new BehaviorSubject(null);
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Constructor
   */
  constructor(
    private _fuseConfirmationService: FuseConfirmationService,
    private appointmentService: AppointmentService,
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
    this.appointments = this.appointmentService.getAppointmentsList();
    this.appointments.pipe(
      takeUntil(this._unsubscribeAll)
    ).subscribe((appointments: Appointment[]) => {
      this.appointmentsCount = appointments.length;
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
    this.filter$.next('appointments');
  }

  addNewAppointment(): void {
    this._matDialog.open(AppointmentAddComponent, {
      autoFocus: false,
      data: {
      }
    });
  }

  updateAppointment(appointment: Appointment): void {
    if (appointment && appointment.id) {
      this._matDialog.open(AppointmentUpdateComponent, {
        autoFocus: false,
        data: { appointment: appointment } // Pass patient object here
      });
    } else {
      console.error('Appointment ID is undefined.');
    }
  }

  deleteAppointmentt(appointment: Appointment): void {
    console.log("Appointment to be deleted:", appointment);

    // Open the confirmation dialog
    const confirmation = this._fuseConfirmationService.open({
      title: 'Delete Appointment',
      message: 'Are you sure you want to remove this appointment? This action cannot be undone!',
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
        this.appointmentService.deleteAppointment(appointment).subscribe(
          () => {
            console.log('Appointment deleted successfully.');
            this.reloadData(); // Reload data after deletion
          },
          (error) => {
            console.error('Error deleting appointment:', error);
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
  trackByFn(index: number, appointment: Appointment): any {
    return appointment.id || index;
  }

  convertDateFormat(dateString: string): string {
    const parsedDate = new Date(dateString);
    return this.datePipe.transform(parsedDate, 'dd/MM/yyyy'); // Format date as dd/mm/yyyy
  }

}
