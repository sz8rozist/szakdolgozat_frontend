import { Injectable } from '@angular/core';
import { ApiUrlService } from './api-url.service';
import { HttpClient } from '@angular/common/http';
import { Trainer } from '../model/Trainer';
import { Guest } from '../model/Guest';

@Injectable({
  providedIn: 'root'
})
export class GuestService {

  constructor(private apiUrlService: ApiUrlService, private http: HttpClient) { }

  findTrainer(guestId: number){
    return this.http.get<Trainer>(`${this.apiUrlService.getApiUrl()}/guest/${guestId}`);
  }

  getAllGuest(){
    return this.http.get<Guest[]>(`${this.apiUrlService.getApiUrl()}/guest`);
  }

  getTrainerGuests(trainerId: number){
    return this.http.get<Guest[]>(`${this.apiUrlService.getApiUrl()}/guest/${trainerId}/getTrainerGuests`);
  }

  addTrainerToGuest(guestId: string, trainerId: string){
    const data = new FormData();
    data.append('guestId', guestId);
    data.append('trainerId', trainerId);
    return this.http.post(`${this.apiUrlService.getApiUrl()}/guest/addTrainerToGuest`, data);
  }

  getById(guestId: number){
    return this.http.get<Guest>(`${this.apiUrlService.getApiUrl()}/guest/guestById/${guestId}`);

  }
}
