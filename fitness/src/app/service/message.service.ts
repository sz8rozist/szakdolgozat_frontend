import { Injectable } from '@angular/core';
import { ApiUrlService } from './api-url.service';
import { HttpClient } from '@angular/common/http';
import { MessageDto } from '../model/dto/MessageDto';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private apiUrlService: ApiUrlService,
    private http: HttpClient) { }

  getAll(senderUserId: number, receiverUserId:number){
    return this.http.get<MessageDto[]>(`${this.apiUrlService.getApiUrl()}/message/${senderUserId}/${receiverUserId}`);
  }
}
