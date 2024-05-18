import { Component, Injectable, OnInit } from '@angular/core';
import { User } from 'app/shared/models/users/user';
import { NotificationService } from 'app/shared/services/notificationService/notification.service';
import { UserService } from 'app/shared/services/userService/user.service';
import { WebSocketService } from 'app/shared/services/webSocketService/web-socket.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root'
})

export class NotificationsMockApi implements OnInit {

  notifications: any[] = [];

  authenticatedUser: User;

  authenticatedUserId: string;

  constructor(
    private _apiUser: UserService,
    private notificationService: NotificationService,
    private webSocketService: WebSocketService,
    private _cookie: CookieService  
  ) { }

  ngOnInit(): void {
    this.authenticatedUserId = this._cookie.get('id');

    this.loadNotifications();

    // Subscribe to WebSocket notifications
    this.webSocketService.subscribe('/user/${this.authenticatedUserId}/notify', (message) => {
      const notification = JSON.parse(message.body);
      this.notifications.unshift(notification);
    });
  }

  getAuthenticatedUser(id: string): void {
    this._apiUser.getUser(id).subscribe({
      next:(result) => {
        this.authenticatedUser = result;
      }
    });
  }

  loadNotifications() {
    this.notificationService.getNotifications(this.authenticatedUserId).subscribe((data) => {
      this.notifications = data;
    }, error => {
      console.error('Error fetching notifications:', error);
    });
  }

  /*markAllAsRead() {
    this.notificationService.markAllAsRead().subscribe(() => {
      this.notifications.forEach(notification => notification.read = true);
    }, error => {
      console.error('Error marking notifications as read:', error);
    });
  }*/
}
