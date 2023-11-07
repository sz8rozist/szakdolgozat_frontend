import { Injectable } from '@angular/core';
import { PrivateChatMessage } from '../model/PrivateChatMessage';
import { StompConfig, Client } from '@stomp/stompjs';
import { Observable, Subject } from 'rxjs';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private stompClient: Client = new Client();
  private messageSubject: Subject<PrivateChatMessage> =
    new Subject<PrivateChatMessage>();
  constructor(
    private authService: AuthService
  ) {
    this.initializeWebSocketConnection();
  }
  initializeWebSocketConnection() {
    const stompConfig: StompConfig = {
      webSocketFactory: () => new WebSocket('ws://localhost:8080/ws'),
      debug: (str) => {},
      reconnectDelay: 500,
      onConnect: () => {
        console.log('WebSocket connected');
        // Itt tudsz üzeneteket küldeni a szerver felé
        const token = this.authService.getDecodedToken();
        setTimeout(() => {
          this.stompClient.subscribe(`/queue/private/${token.sub}`, (message) => {
            this.messageSubject.next(JSON.parse(message.body));
          });
        }, 1000);
      },
    };
    this.stompClient = new Client(stompConfig);
    this.stompClient.activate();
  }
  // Üzenet küldése a szerver felé
  sendPrivateMessage(message: PrivateChatMessage) {
    this.stompClient.publish({
      destination: `/app/chat.sendPrivateMessage/${message.receiverUserId}`,
      body: JSON.stringify(message),
    });
  }

  getMessages(): Observable<PrivateChatMessage> {
    return this.messageSubject.asObservable();
  }
}
