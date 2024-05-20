import { Injectable } from '@angular/core';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient: Client;
  private subscriptions: StompSubscription[] = [];
  authenticatedUserId: string;

  constructor() {
    this.stompClient = new Client({
      brokerURL: 'ws://localhost:8080/core-services/notification',
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      webSocketFactory: () => new SockJS('http://localhost:8080/core-services/notification'),
    });

    this.stompClient.onConnect = () => {
      console.log('Connected');
      this.subscribeToTopics();
    };

    this.stompClient.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    this.stompClient.onWebSocketClose = (evt) => {
      console.log('WebSocket closed', evt);
    };

    this.stompClient.activate();
  }

  private subscribeToTopics(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];
    // Add your subscription topics here
    // Example:
    this.subscriptions.push(this.stompClient.subscribe(`/user/${this.authenticatedUserId}/notify`, (message: IMessage) => {
      try {
        const parsedMessage = JSON.parse(message.body);
        // Handle the parsed message here
        console.log(parsedMessage);
      } catch (error) {
        console.error('Error parsing WebSocket message: ', error);
      }
    }));
  }

  subscribe(topic: string, callback: (message: any) => void): void {
    const subscription = this.stompClient.subscribe(topic, (message: IMessage) => {
      try {
        const parsedMessage = JSON.parse(message.body);
        callback(parsedMessage);
      } catch (error) {
        console.error('Error parsing WebSocket message: ', error);
      }
    });
    this.subscriptions.push(subscription);
  }

  sendMessage(destination: string, message: any): void {
    if (this.stompClient.connected) {
      const jsonMessage = JSON.stringify(message);
      this.stompClient.publish({ destination, body: jsonMessage });
    } else {
      console.error('STOMP client is not connected');
    }
  }
}
