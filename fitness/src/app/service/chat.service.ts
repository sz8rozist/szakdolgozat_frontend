import { Injectable } from '@angular/core';
import { StompConfig, Client } from '@stomp/stompjs';
import { Observable, Subject } from 'rxjs';
import { AuthService } from './auth.service';
import { MessageDto } from '../model/dto/MessageDto';
@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private stompClient: Client = new Client();
  private messageSubject: Subject<MessageDto> =
    new Subject<MessageDto>();
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
        if(token){
          setTimeout(() => {
            this.stompClient.subscribe(`/queue/private/${token.sub}`, (message) => {
              this.messageSubject.next(JSON.parse(message.body));
            });
          }, 1000);
        }
      },
    };
    this.stompClient = new Client(stompConfig);
    this.stompClient.activate();
  }
  // Üzenet küldése a szerver felé
  sendPrivateMessage(message: MessageDto) {
    this.stompClient.publish({
      destination: `/app/chat.sendPrivateMessage/${message.receiverUserId}`,
      body: JSON.stringify(message),
    });
  }

  getMessages(): Observable<MessageDto> {
    return this.messageSubject.asObservable();
  }
}
