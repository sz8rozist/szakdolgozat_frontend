import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiUrlService } from './api-url.service';
import { WorkoutRequest } from '../model/WorkoutRequest';

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {

  constructor(private http: HttpClient, private apiUrlService: ApiUrlService) {}

  saveWorkout(userId: number, date: string, data: WorkoutRequest[]){
    return this.http.post(`${this.apiUrlService.getApiUrl()}/workout/${userId}/${date}`,data);
  }
}
