import { DatePipe, DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Appointment } from 'app/shared/models/appointment/appointment';
import { AppointmentService } from 'app/shared/services/appointmentService/appointment.service';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, map, Observable, Subject, takeUntil } from 'rxjs';
import { UpdateComponent } from '../update/update.component';

@Component({
  selector: 'app-upcoming',
  templateUrl: './upcoming.component.html',
  styles: [
    `    
.inventory-grid {
      display: grid;
      grid-template-columns: 48px auto 40px; 

      @screen sm {
        grid-template-columns: 48px 200px auto 72px;
      }

      @screen md {
        grid-template-columns: 48px 200px 200px auto 72px;
      }

      @screen lg {
        grid-template-columns: 48px 200px 200px 200px 200px 200px 200px auto 72px;
      }
}

.action-column {
    justify-content: center;
}
    `]
})
export class UpcomingComponent implements OnInit {

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
    this.appointments = this.appointmentService.getPatientAppointmentsList(this._cookie.get('id')).pipe(
        map((appointments: Appointment[]) => appointments.filter(appointment => appointment.appointmentStatus === 'UPCOMING')),
        takeUntil(this._unsubscribeAll)
    );

    this.appointments.subscribe((appointments: Appointment[]) => {
        this.appointmentsCount = appointments.length;
        this._changeDetectorRef.markForCheck(); 
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

 
  updateStatus(appointment: Appointment): void {
    if (appointment && appointment.id) {
      const dialogRef = this._matDialog.open(UpdateComponent, {
        autoFocus: false,
        data: { appointment: appointment }
      });
  
      dialogRef.afterClosed().subscribe(() => {
        this.reloadData();
      });
    } else {
      console.error('Appointment ID is undefined.');
    }
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
    return this.datePipe.transform(parsedDate, 'dd/MM/yyyy');
  }

  formatTime(time: string): string {
    if (time) {
      return time.split(':').slice(0, 2).join(':');
    }
    return '';
  }

  getGenderStyle(gender: string) {
    return {
      backgroundColor: gender === 'FEMALE' ? 'pink' : 'blue',
      color: 'white'
    };
  }

}
