import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private client: Client;

  constructor() {
    this.client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/core-services/ws'),
      reconnectDelay: 5000,
    });

    this.client.onConnect = (frame) => {
      console.log('Connected: ' + frame);
    };

    this.client.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    this.client.activate();
  }

  sendMessage(destination: string, body: any) {
    this.client.publish({ destination, body: JSON.stringify(body) });
  }

  subscribe(destination: string, callback: (message: any) => void) {
    this.client.onConnect = () => {
      this.client.subscribe(destination, callback);
    };
  }
}
