import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { MatButton } from '@angular/material/button';
import { BehaviorSubject, forkJoin, Observable, of, Subject } from 'rxjs';
import { Notification } from 'app/shared/models/notification/notification';
import { CookieService } from 'ngx-cookie-service';
import { User } from 'app/shared/models/users/user';
import { UserService } from 'app/shared/services/userService/user.service';
import { NotificationService } from 'app/shared/services/notificationService/notification.service';
import { WebSocketService } from 'app/shared/services/webSocketService/web-socket.service';
import { catchError, takeUntil } from 'rxjs/operators';
import { AppointmentService } from 'app/shared/services/appointmentService/appointment.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'notifications',
  templateUrl: './notifications.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'notifications'
})
export class NotificationsComponent implements OnInit, OnDestroy {
  @ViewChild('notificationsOrigin') private _notificationsOrigin: MatButton;
  @ViewChild('notificationsPanel') private _notificationsPanel: TemplateRef<any>;

  private _notificationsSubject: BehaviorSubject<Notification[]> = new BehaviorSubject<Notification[]>([]);
  notifications$: Observable<Notification[]> = this._notificationsSubject.asObservable();
  authenticatedUser: User;
  authenticatedUserId: string;
  unreadCount: number = 0;
  private _panelOpenedOnce: boolean = false;
  private _overlayRef: OverlayRef;
  private _unsubscribeAll: Subject<void> = new Subject<void>();

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _overlay: Overlay,
    private _viewContainerRef: ViewContainerRef,
    private _apiUser: UserService,
    private notificationService: NotificationService,
    private appointmentService: AppointmentService,
    private webSocketService: WebSocketService,
    private _cookie: CookieService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.authenticatedUserId = this._cookie.get('id');
    this.getAuthenticatedUser(this.authenticatedUserId);

    this.loadNotifications();

    this.webSocketService.setAuthenticatedUserId(this.authenticatedUserId);

    this.webSocketService.notificationReceived
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(message => {

        const parsedMessage = typeof message === 'string' ? JSON.parse(message) : message;

        const currentNotifications = this._notificationsSubject.getValue();
        this._notificationsSubject.next([parsedMessage, ...currentNotifications]);

        this._calculateUnreadCount();

        this._changeDetectorRef.markForCheck();
      });
  }

  getAuthenticatedUser(id: string): void {
    this._apiUser.getUser(id).subscribe({
      next: (result) => {
        this.authenticatedUser = result;
      }
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  loadNotifications(): void {
    this.notificationService.getNotifications(this.authenticatedUserId).pipe(
      catchError(error => {
        console.error('Error fetching notifications:', error);
        return of([]);
      })
    ).subscribe(notifications => {
      this._notificationsSubject.next(notifications);
      this._calculateUnreadCount();
      this._changeDetectorRef.markForCheck();
    });
  }

  openPanel(): void {
    if (!this._notificationsPanel || !this._notificationsOrigin) {
      return;
    }

    if (!this._overlayRef) {
      this._createOverlay();
    }

    this._overlayRef.attach(new TemplatePortal(this._notificationsPanel, this._viewContainerRef));

    this._changeDetectorRef.markForCheck();
  }

  closePanel(): void {
    if (this._overlayRef) {
      this._overlayRef.detach();

      // Mark notifications as read in the backend
      this.markNotificationsAsRead();
    }
  }

  private markNotificationsAsRead(): void {
    const notifications = this._notificationsSubject.getValue();
    const unreadNotifications = notifications.filter(notification => notification.notificationStatus === 'UNREAD');

    if (unreadNotifications.length > 0) {
      const markAsReadObservables = unreadNotifications.map(notification => {
        if (notification.id) {
          return this.notificationService.markAsRead(notification.id);
        } else {
          return of(null); // return an observable that does nothing
        }
      });

      // Use forkJoin to wait for all markAsRead observables to complete
      forkJoin(markAsReadObservables).subscribe({
        next: () => {
          // Reload notifications after marking as read
          this.loadNotifications();
        },
        error: (err) => {
          console.error('Error marking notifications as read:', err);
        }
      });
    }
  }

  rejectAppointment(notification: Notification): void {
    if (notification.appointment && notification.appointment.id) {
      this.appointmentService.rejectAppointment(notification.appointment.id).subscribe({
        next: (response) => {
          console.log(response);

          this.loadNotifications();
        },
        error: (err) => {
          console.error('Error rejecting appointment:', err);
        }
      });
    } else {
      console.error('Appointment or appointment ID is undefined.');
    }
  }

  approveNotification(notification: Notification): void {
    if (notification.appointment && notification.appointment.id) {
      this.appointmentService.approveAppointment(notification.appointment.id).subscribe({
        next: (response) => {
          this.loadNotifications();
        },
        error: (err) => {
          console.error('Error approving appointment:', err);
        }
      });
    } else {
      console.error('Appointment or appointment ID is undefined.');
    }
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  private _createOverlay(): void {
    this._overlayRef = this._overlay.create({
      hasBackdrop: true,
      backdropClass: 'fuse-backdrop-on-mobile',
      scrollStrategy: this._overlay.scrollStrategies.block(),
      positionStrategy: this._overlay.position()
        .flexibleConnectedTo(this._notificationsOrigin._elementRef.nativeElement)
        .withLockedPosition(true)
        .withPush(true)
        .withPositions([
          {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'top'
          },
          {
            originX: 'start',
            originY: 'top',
            overlayX: 'start',
            overlayY: 'bottom'
          },
          {
            originX: 'end',
            originY: 'bottom',
            overlayX: 'end',
            overlayY: 'top'
          },
          {
            originX: 'end',
            originY: 'top',
            overlayX: 'end',
            overlayY: 'bottom'
          }
        ])
    });

    this._overlayRef.backdropClick().subscribe(() => {
      this._overlayRef.detach();
    });
  }

  /**
   * Calculate the unread count
   */
  private _calculateUnreadCount(): void {
    const notifications = this._notificationsSubject.getValue();
    this.unreadCount = notifications.filter(notification => notification.notificationStatus === 'UNREAD').length;
  }
}
