import { Injectable } from '@angular/core';
import { PrivateChatMessage } from '../model/PrivateChatMessage';
import { StompConfig, Client } from '@stomp/stompjs';
import { Observable, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private stompClient: Client = new Client();
  private messageSubject: Subject<PrivateChatMessage> =
    new Subject<PrivateChatMessage>();
  constructor() {
    this.initializeWebSocketConnection();
  }
  initializeWebSocketConnection() {
    const stompConfig: StompConfig = {
      webSocketFactory: () => new WebSocket('ws://localhost:8080/ws'),
      debug: (str) => {},
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('WebSocket connected');
        // Itt tudsz üzeneteket küldeni a szerver felé
        this.stompClient.subscribe(`/topic/public`, (message) => {
          this.messageSubject.next(JSON.parse(message.body));
        });
      },
    };
    this.stompClient = new Client(stompConfig);
    this.stompClient.activate();
  }
  // Üzenet küldése a szerver felé
  sendPrivateMessage(message: PrivateChatMessage) {
    this.stompClient.publish({
      destination: '/app/chat.sendPrivateMessage',
      body: JSON.stringify(message),
    });
  }

  getMessages(): Observable<PrivateChatMessage> {
    return this.messageSubject.asObservable();
  }
}
