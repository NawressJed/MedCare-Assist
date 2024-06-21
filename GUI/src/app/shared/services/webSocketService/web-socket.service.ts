import { Injectable } from '@angular/core';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient: Client;
  private subscriptions: StompSubscription[] = [];
  authenticatedUserId: string; // Ensure this is set appropriately

  constructor() {
    // Initializing the STOMP client
    this.stompClient = new Client({
      brokerURL: 'ws://localhost:8080/core-services/ws',
      reconnectDelay: 5000, 
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000, 
      webSocketFactory: () => new SockJS('http://localhost:8080/core-services/ws'),
    });

    // Setting up the connection event handlers
    this.stompClient.onConnect = () => {
      console.log('Connected');
      this.subscribeToTopics(); // Subscribing to topics on connect
    };

    this.stompClient.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    this.stompClient.onWebSocketClose = (evt) => {
      console.log('WebSocket closed', evt);
    };

    this.stompClient.activate(); // Activating the STOMP client
  }

  // Subscribe to predefined topics
  private subscribeToTopics(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];
    // Subscription for notifications
    this.subscriptions.push(this.stompClient.subscribe(`/user/${this.authenticatedUserId}/notify`, (message: IMessage) => {
      try {
        const parsedMessage = JSON.parse(message.body);
      } catch (error) {
        console.error('Error parsing WebSocket message: ', error);
      }
    }));
    // Subscription for chat messages
    this.subscriptions.push(this.stompClient.subscribe(`/user/${this.authenticatedUserId}/queue/messages`, (message: IMessage) => {
      try {
        const parsedMessage = JSON.parse(message.body);
        console.log('Received message:', parsedMessage);
        // Handle incoming chat messages here
      } catch (error) {
        console.error('Error parsing WebSocket message: ', error);
      }
    }));
  }

  // Subscribe to a specific topic
  subscribe(topic: string, callback: (message: any) => void): void {
    const subscription = this.stompClient.subscribe(topic, (message: IMessage) => {
      try {
        const parsedMessage = JSON.parse(message.body);
        callback(parsedMessage);
      } catch (error) {
        console.error('Error parsing WebSocket message: ', error);
      }
    });
    this.subscriptions.push(subscription); // Keeping track of subscriptions to manage them later
  }

  // Send a message to a specific destination
  sendMessage(destination: string, message: any): void {
    if (this.stompClient.connected) {
      const jsonMessage = JSON.stringify(message);
      this.stompClient.publish({ destination, body: jsonMessage }); // Publish message if connected
    } else {
      console.error('STOMP client is not connected');
    }
  }
}
