import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiUrlService } from './api-url.service';
import { WebsocketService } from './websocket.service';
import { SocketDietDto } from '../model/dto/SocketDietDto';
import { NotificationDto } from '../model/dto/NotificationDto';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http: HttpClient, private apiUrlService: ApiUrlService, private webSocketService: WebsocketService) {}

  sendNotificationToTrainer(message: SocketDietDto) {
    this.webSocketService.sendDietNotification(message);
  }

  getTrainerNotification() {
    return this.webSocketService.getDietNotificationToTrainer();
  }

  getLastFiveDietNotificationForTrainer(trainerId: number){
    return this.http.get<NotificationDto[]>(`${this.apiUrlService.getApiUrl()}/notification/${trainerId}`);
  }
}
