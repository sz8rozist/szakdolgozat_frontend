import { Injectable } from '@angular/core';
import { StompConfig, Client } from '@stomp/stompjs';
import { Observable, Subject } from 'rxjs';
import { AuthService } from './auth.service';
import { MessageDto } from '../model/dto/MessageDto';
import { WebsocketService } from './websocket.service';
import { ApiUrlService } from './api-url.service';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private webSocketService: WebsocketService, private apiUrlService: ApiUrlService, private http: HttpClient) {}

  sendPrivateMessage(message: MessageDto) {
    this.webSocketService.sendPrivateMessage(message);
  }

  getMessages() {
    return this.webSocketService.getMessages();
  }

  getAllMessage(senderUserId: number, receiverUserId:number){
    return this.http.get<MessageDto[]>(`${this.apiUrlService.getApiUrl()}/message/${senderUserId}/${receiverUserId}`);
  }
}
