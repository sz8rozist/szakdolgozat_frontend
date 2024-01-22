import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiUrlService } from './api-url.service';
import { WebsocketService } from './websocket.service';
import { SocketDietDto } from '../model/dto/SocketDietDto';
import { Notification } from 'src/app/model/Notification';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject: Subject<Notification[]> = new Subject<Notification[]>();
  constructor(private http: HttpClient, private apiUrlService: ApiUrlService, private webSocketService: WebsocketService) {}

  sendNotificationToTrainer(message: SocketDietDto) {
    this.webSocketService.sendDietNotification(message);
  }

  getNotificationSubject(): Observable<Notification[]>{
    return this.notificationSubject.asObservable();
  }

  setNotificationSubject(data: Notification[]){
    this.notificationSubject.next(data);
  }

  getTrainerNotification() {
    return this.webSocketService.getDietNotificationToTrainer();
  }

  getAll(userId: number){
    return this.http.get<Notification[]>(`${this.apiUrlService.getApiUrl()}/notification/${userId}`);
  }
  delete(id: number){
    return this.http.delete(`${this.apiUrlService.getApiUrl()}/notification/${id}`, {observe: 'response'});
  }
  markAsViewed(id: number){
    return this.http.put(`${this.apiUrlService.getApiUrl()}/notification/${id}`,{}, {observe: 'response'});
  }
  markAllAsViewed(userId: number){
    return this.http.put(`${this.apiUrlService.getApiUrl()}/notification/all/${userId}`,{}, {observe: 'response'});

  }
}
