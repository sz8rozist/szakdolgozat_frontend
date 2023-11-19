import { Injectable } from '@angular/core';
import { StompConfig, Client } from '@stomp/stompjs';
import { Observable, Subject } from 'rxjs';
import { AuthService } from './auth.service';
import { MessageDto } from '../model/dto/MessageDto';
import { WebsocketService } from './websocket.service';
@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private webSocketService: WebsocketService) {}

  sendPrivateMessage(message: MessageDto) {
    this.webSocketService.sendPrivateMessage(message);
  }

  getMessages() {
    return this.webSocketService.getMessages();
  }
}
