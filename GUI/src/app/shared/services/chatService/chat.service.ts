import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { ChatMessage } from 'app/shared/models/chat/chat-message';
import { WebSocketService } from '../webSocketService/web-socket.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private baseUrl = 'http://localhost:8080/core-services';

  constructor(private http: HttpClient,
     private webSocketService: WebSocketService
    ) {}

    getChatHistory(): Observable<ChatMessage[]> {
      return this.http.get<ChatMessage[]>(`${this.baseUrl}/chat/history`);
    }

    getChats(senderId: string, recipientId: string): Observable<ChatMessage[]> {
      return this.http.get<ChatMessage[]>(`${this.baseUrl}/messages`, {
        params: {
          senderId,
          recipientId
        }
      });
    }
  
    sendMessage(message: ChatMessage): void {
      this.http.post(`${this.baseUrl}/message`, message).subscribe();
    }

}
