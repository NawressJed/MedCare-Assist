import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { MatButton } from '@angular/material/button';
import { BehaviorSubject, Observable, of, Subject, Subscription } from 'rxjs';
import { Notification } from 'app/shared/models/notification/notification';
import { CookieService } from 'ngx-cookie-service';
import { User } from 'app/shared/models/users/user';
import { UserService } from 'app/shared/services/userService/user.service';
import { NotificationService } from 'app/shared/services/notificationService/notification.service';
import { WebSocketService } from 'app/shared/services/webSocketService/web-socket.service';
import { catchError } from 'rxjs/operators';
import { AppointmentService } from 'app/shared/services/appointmentService/appointment.service';
import { Appointment } from 'app/shared/models/appointment/appointment';

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
  private _overlayRef: OverlayRef;
  private _unsubscribeAll: Subject<void> = new Subject<void>();
  private wsSubscription: Subscription;

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _overlay: Overlay,
    private _viewContainerRef: ViewContainerRef,
    private _apiUser: UserService,
    private notificationService: NotificationService,
    private appointmentService: AppointmentService,
    private webSocketService: WebSocketService,
    private _cookie: CookieService
  ) { }

  ngOnInit(): void {
    this.authenticatedUserId = this._cookie.get('id');
    this.getAuthenticatedUser(this.authenticatedUserId);

    //this.loadNotifications();

    this.webSocketService.subscribe(`/user/${this.authenticatedUserId}/notify`, (message) => {
      const notification = new Notification();
      notification.title = message.title;
      notification.message = message.message;
      if (message.appointment) {
        notification.appointment = new Appointment();
        notification.appointment.id = message.appointment.id;
        notification.appointment.date = message.appointment.date;
        notification.appointment.time = message.appointment.time;
      }
      const currentNotifications = this._notificationsSubject.getValue();
      this._notificationsSubject.next([notification, ...currentNotifications]);

      this._changeDetectorRef.markForCheck();
    });
  }

  getAuthenticatedUser(id: string): void {
    this._apiUser.getUser(id).subscribe({
      next:(result) => {
        this.authenticatedUser = result;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.wsSubscription) {
      this.wsSubscription.unsubscribe();
    }
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
  }

  closePanel(): void {
    this._overlayRef.detach();
  }

  delete(notification: Notification): void {
    // Delete the notification
  }

  approveNotification(notification: Notification): void {
    if (notification.appointment && notification.appointment.id) {
      this.appointmentService.approveAppointment(notification.appointment.id).subscribe({
        next: (response) => {
          console.log(`Approved appointment with ID: ${notification.appointment.id}`);
          console.log(response);  // This will log the plain text response
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
}
