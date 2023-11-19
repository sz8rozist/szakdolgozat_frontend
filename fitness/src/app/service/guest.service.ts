import { Injectable } from '@angular/core';
import { ApiUrlService } from './api-url.service';
import { HttpClient } from '@angular/common/http';
import { Trainer } from '../model/Trainer';

@Injectable({
  providedIn: 'root'
})
export class GuestService {

  constructor(private apiUrlService: ApiUrlService, private http: HttpClient) { }

  findTrainer(guestId: number){
    return this.http.get<Trainer>(`${this.apiUrlService.getApiUrl()}/guest/${guestId}`);
  }

}
