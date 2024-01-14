import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiUrlService } from './api-url.service';
import { WebsocketService } from './websocket.service';
import { DietRecommendation } from '../model/DietRecommendation';

@Injectable({
  providedIn: 'root'
})
export class DietRecommendationService {
  constructor(private http: HttpClient, private apiUrlService: ApiUrlService) {}
  saveRecommendation(dietRecommendation: DietRecommendation, guestId: string, trainerId: string) {
    return this.http.post<DietRecommendation>(`${this.apiUrlService.getApiUrl()}/dietRecommendation/${guestId}/${trainerId}`, dietRecommendation);
  }
}
