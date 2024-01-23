import { Injectable } from '@angular/core';
import { Client, StompConfig } from '@stomp/stompjs';
import { Subject, Observable } from 'rxjs';
import { MessageDto } from '../model/dto/MessageDto';
import { AuthService } from './auth.service';
import { SocketDietDto } from '../model/dto/SocketDietDto';
import { NotificationModel } from '../model/NotificationModel';
import { Notification } from '../model/Notification';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private stompClient: Client = new Client();
  private messageSubject: Subject<MessageDto> = new Subject<MessageDto>();
  private dietSubject: Subject<Notification> = new Subject<Notification>();

  constructor(private authService: AuthService) {
    this.initializeWebSocketConnection();
  }

  initializeWebSocketConnection() {
    const stompConfig: StompConfig = {
      webSocketFactory: () => new WebSocket('ws://localhost:8080/ws'),
      debug: (str) => {},
      reconnectDelay: 500,
      onConnect: () => {
        console.log('WebSocket connected');
        const token = this.authService.getDecodedToken();
        if (token) {
          setTimeout(() => {
            this.stompClient.subscribe(
              `/queue/private/${token.sub}`,
              (message) => {
                this.messageSubject.next(JSON.parse(message.body));
              }
            );
            this.stompClient.subscribe(
              `/queue/trainerNotification/${token.sub}`,
              (message) => {
                this.dietSubject.next(JSON.parse(message.body));
              }
            );
          }, 1000);
        }
      },
    };
    this.stompClient = new Client(stompConfig);
    this.stompClient.activate();
  }

  sendPrivateMessage(message: MessageDto) {
    this.stompClient.publish({
      destination: `/app/chat.sendPrivateMessage/${message.receiverUserId}`,
      body: JSON.stringify(message),
    });
  }

  getMessages(): Observable<MessageDto> {
    return this.messageSubject.asObservable();
  }

  sendDietNotification(message: SocketDietDto) {
    this.stompClient.publish({
      destination: `/app/trainer.diet/${message.trainerId}`,
      body: JSON.stringify(message),
    });
  }

  getDietNotificationToTrainer() {
    return this.dietSubject.asObservable();
  }
}
