import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {

  private apiUrl = 'http://localhost:5000/chat'; 

  constructor(private http: HttpClient) { }

  sendMessage(userMessage: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { message: userMessage });
  }
}
