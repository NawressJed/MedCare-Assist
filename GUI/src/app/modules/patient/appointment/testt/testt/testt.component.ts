import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { AppointmentRequestComponent } from '../../appointment-request/appointment-request.component';
import { MatDrawer } from '@angular/material/sidenav';
import { Appointment } from 'app/shared/models/appointment/appointment';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ActivatedRoute, Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentService } from 'app/shared/services/appointmentService/appointment.service';

@Component({
  selector: 'app-testt',
  templateUrl: './testt.component.html',
  styleUrls: ['./testt.component.scss']
})
export class TesttComponent implements OnInit {

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
    
  ) {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
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
    const dialogRef = this._matDialog.open(AppointmentRequestComponent, {
      autoFocus: false,
      data: {
      }
    });
  
    dialogRef.afterClosed().subscribe(() => {
      
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

}
