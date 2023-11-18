import { Injectable } from '@angular/core';
import { ApiUrlService } from './api-url.service';
import { HttpClient } from '@angular/common/http';
import { Trainer } from '../model/Trainer';
import { ChooseTrainerRequest } from '../model/ChooseTrainerRequest';

@Injectable({
  providedIn: 'root'
})
export class TrainerService {

  constructor(private apiUrlService: ApiUrlService, private http: HttpClient) { }

  getAllTrainer(){
    return this.http.get<Trainer[]>(`${this.apiUrlService.getApiUrl()}/trainer`);
  }
  chooseTrainer(data: ChooseTrainerRequest){
    return this.http.post(`${this.apiUrlService.getApiUrl()}/trainer`,data);
  }
}
