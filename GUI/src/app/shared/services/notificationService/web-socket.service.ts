import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
@Injectable({
 providedIn: 'root',
})
export class WebSocketService {
 private webSocket: Socket;
 constructor() {
  this.webSocket = new Socket({
   url: "http://localhost:8080/notifications/ws",
   options: {},
  });
 }

 // this method is used to start connection/handhshake of socket with server
 connectSocket(message) {
  this.webSocket.emit('connect', message);
 }

 // this method is used to get response from server
 receiveStatus() {
  return this.webSocket.fromEvent('/user');
 }

 // this method is used to end web socket connection
 disconnectSocket() {
  this.webSocket.disconnect();
 }
}