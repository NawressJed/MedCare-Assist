import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DOCUMENT, DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { filter, fromEvent, Observable, Subject, switchMap, BehaviorSubject, takeUntil } from 'rxjs';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { AppointmentAddComponent } from '../appointment-add/appointment-add.component';
import { AppointmentUpdateComponent } from '../appointment-update/appointment-update.component';
import { AppointmentService } from '../../../../shared/services/appointmentService/appointment.service';
import { Appointment } from '../../../../shared/models/appointment/appointment';
import { CookieService } from 'ngx-cookie-service';
import { UserAuthService } from 'app/shared/services/authService/user-auth.service';

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styles: [
    `
    .female {
      background-color: #ff4d88;
      color: white; 
    }
    
    .male {
      background-color: #0033cc;
      color: white;
    }
    
.inventory-grid {
    grid-template-columns: 48px auto 40px;

    @screen sm {
        grid-template-columns: 48px 112px 112px 112px 112px 112px 112px auto 72px;
    }

    @screen md {
        grid-template-columns: 48px 112px 112px 112px 112px 112px 112px auto 72px;
    }

    @screen lg {
      grid-template-columns: 48px 200px 200px 200px 200px 200px auto 72px;
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
    private datePipe: DatePipe,
    private _cookie: CookieService
    
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
    this.appointments = this.appointmentService.getDoctorAppointmentsList(this._cookie.get('id'));
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
    const dialogRef = this._matDialog.open(AppointmentAddComponent, {
      autoFocus: false,
      data: {
      }
    });
  
    dialogRef.afterClosed().subscribe(() => {
      this.reloadData();
    });
  }

  updateAppointment(appointment: Appointment): void {
    if (appointment && appointment.id) {
      const dialogRef = this._matDialog.open(AppointmentUpdateComponent, {
        autoFocus: false,
        data: { appointment: appointment } // Pass patient object here
      });
      
      dialogRef.afterClosed().subscribe(() => {
        this.reloadData();
      });
    } else {
      console.error('Appointment ID is undefined.');
    }
  }

  deleteAppointment(appointment: Appointment): void {
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

  formatTime(time: string): string {
    if (time) {
      return time.split(':').slice(0, 2).join(':'); // Extract hours and minutes and join them
    }
    return '';
  }

  getGenderStyle(gender: string) {
    return {
      backgroundColor: gender === 'FEMALE' ? 'pink' : 'blue',
      color: 'white'  // Set text color to white for contrast
    };
  }   
  
}
