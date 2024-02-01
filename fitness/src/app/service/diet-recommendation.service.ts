import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiUrlService } from './api-url.service';
import { WebsocketService } from './websocket.service';
import { DietRecommendation } from '../model/DietRecommendation';
import { NutiritonRequest } from '../model/NutiritonRequest';
import { Nutiriton } from '../model/Nutrition';

@Injectable({
  providedIn: 'root'
})
export class DietRecommendationService {
  constructor(private http: HttpClient, private apiUrlService: ApiUrlService) {}
  saveRecommendation(dietRecommendation: DietRecommendation, guestId: string, trainerId: string) {
    return this.http.post<DietRecommendation>(`${this.apiUrlService.getApiUrl()}/dietRecommendation/${guestId}/${trainerId}`, dietRecommendation);
  }
  getRecommendation(guestUserId: string, date: string){
    return this.http.get<DietRecommendation>(`${this.apiUrlService.getApiUrl()}/dietRecommendation/${guestUserId}/${date}`);
  }

  getDietRecommedations(guestId: number, trainerUserId: number){
    return this.http.get<DietRecommendation[]>(`${this.apiUrlService.getApiUrl()}/dietRecommendation/guest/${guestId}/${trainerUserId}`);
  }

  deleteRecommendation(id: number){
    return this.http.delete(`${this.apiUrlService.getApiUrl()}/dietRecommendation/${id}`, {observe: 'response'});
  }
  updateRecommendation(id: number, dietRecommendation: DietRecommendation){
    return this.http.put<DietRecommendation>(`${this.apiUrlService.getApiUrl()}/dietRecommendation/${id}`, dietRecommendation);
  }

  getById(id: number){
    return this.http.get<DietRecommendation>(`${this.apiUrlService.getApiUrl()}/dietRecommendation/get/${id}`);
  }
  update(id: number, data: DietRecommendation){
    return this.http.put<DietRecommendation>(`${this.apiUrlService.getApiUrl()}/dietRecommendation/${id}`, data);
  }

  calculateNutrition(data: NutiritonRequest){
    return this.http.post<Nutiriton>(`${this.apiUrlService.getApiUrl()}/dietRecommendation/nutritionCalculate`, data);
  }
}
