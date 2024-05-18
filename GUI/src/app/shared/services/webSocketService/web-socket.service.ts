// web-socket.service.ts
import { Injectable } from '@angular/core';
import { Client, StompSubscription } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient: Client;
  private subscriptions: Map<string, StompSubscription> = new Map();

  constructor() {
    this.initializeWebSocketConnection();
  }

  initializeWebSocketConnection() {
    const serverUrl = 'http://localhost:8080/core-services/notification';
    this.stompClient = new Client({
      brokerURL: serverUrl,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      webSocketFactory: () => new SockJS(serverUrl)
    });

    this.stompClient.onConnect = (frame) => {
      console.log('Connected: ' + frame);
    };

    this.stompClient.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    this.stompClient.activate();
  }

  subscribe(destination: string, callback: (message: any) => void) {
    if (this.subscriptions.has(destination)) {
      console.warn(`Already subscribed to ${destination}`);
      return;
    }

    const subscription: StompSubscription = this.stompClient.subscribe(destination, (message) => {
      try {
        const parsedMessage = JSON.parse(message.body);
        console.log('Received message: ', parsedMessage); // Log received message
        callback(parsedMessage);
      } catch (error) {
        console.error('Error parsing WebSocket message: ', error);
        console.error('Received message: ', message.body);
      }
    });

    this.subscriptions.set(destination, subscription);
  }

  unsubscribe(destination: string) {
    const subscription = this.subscriptions.get(destination);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(destination);
    }
  }

  sendMessage(destination: string, message: any) {
    console.log('Sending message: ', message);
    this.stompClient.publish({
      destination: destination,
      body: JSON.stringify(message)
    });
  }
}
