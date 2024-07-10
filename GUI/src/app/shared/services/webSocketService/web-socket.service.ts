import { Injectable } from '@angular/core';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import { BehaviorSubject, Subject } from 'rxjs';
import * as SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient: Client;
  private subscriptions: StompSubscription[] = [];
  public notificationReceived: Subject<any> = new Subject<any>();
  public chatMessageReceived: Subject<any> = new Subject<any>();
  private isConnected: boolean = false;
  authenticatedUserId: string;

  constructor() {
    this.initializeWebSocket();
  }

  private initializeWebSocket(): void {
    if (this.isConnected) {
      console.warn('WebSocket is already connected');
      return;
    }

    this.stompClient = new Client({
      brokerURL: 'ws://localhost:8080/core-services/ws',
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      webSocketFactory: () => new SockJS('http://localhost:8080/core-services/ws'),
    });

    this.stompClient.onConnect = () => {
      console.log('Connected');
      this.isConnected = true;
      this.subscribeToTopics();
    };

    this.stompClient.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    this.stompClient.onWebSocketClose = (evt) => {
      console.log('WebSocket closed', evt);
      this.isConnected = false;
    };

    this.stompClient.activate();
  }

  setAuthenticatedUserId(userId: string): void {
    this.authenticatedUserId = userId;
    if (this.isConnected) {
      this.subscribeToTopics();
    }
  }

  private subscribeToTopics(): void {
    // Unsubscribe from all previous subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];

    if (!this.authenticatedUserId) {
      console.warn('Authenticated user ID is not set');
      return;
    }

    // Subscription for notifications
    const notificationSub = this.stompClient.subscribe(`/user/${this.authenticatedUserId}/notify`, (message: IMessage) => {
      try {
        const parsedMessage = JSON.parse(message.body);
        this.notificationReceived.next(parsedMessage);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });

    // Subscription for chat messages
    const chatSub = this.stompClient.subscribe(`/user/${this.authenticatedUserId}/queue/messages`, (message: IMessage) => {
      try {
        const parsedMessage = JSON.parse(message.body);
        this.chatMessageReceived.next(parsedMessage);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });

    // Store subscriptions for later management
    this.subscriptions.push(notificationSub, chatSub);
  }

  sendMessage(destination: string, message: any, recipientUserId?: string): void {
    if (this.stompClient.connected) {
      const jsonMessage = JSON.stringify({ ...message, senderId: this.authenticatedUserId });
      const targetDestination = recipientUserId ? `/user/${recipientUserId}${destination}` : destination;
      this.stompClient.publish({ destination: targetDestination, body: jsonMessage });
    } else {
      console.error('STOMP client is not connected');
    }
  }
}
