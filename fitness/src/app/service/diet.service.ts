import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiUrlService } from './api-url.service';
import { Food } from '../model/Food';
import { Diet } from '../model/Diet';
import { DietResponse } from '../model/DietResponse';
import { DietUpdateRequest } from '../model/DietUpdateRequest';
import { DietSummary } from '../model/DietSummary';
import { CaloriesSum } from '../model/CaloriesSum';
import { MealFrequency } from '../model/MealFrequency';
import { DietRecommendation } from '../model/DietRecommendation';
import { ExerciseRegularity } from '../model/ExerciseRegularity';
import { RecentlyUsedExercise } from '../model/RecentlyUsedExercise';
import { CalendarEvent } from '../model/CalendarEvent';
@Injectable({
  providedIn: 'root',
})
export class DietService {
  constructor(
    private http: HttpClient,
    private apiUrlService: ApiUrlService,
  ) {}

  createFood(food: Food) {
    return this.http.post<Food>(`${this.apiUrlService.getApiUrl()}/food`, food);
  }

  getAllFood(offset: number, pageSize: number) {
    return this.http.get<Food[]>(
      `${this.apiUrlService.getApiUrl()}/food/${offset}/${pageSize}`
    );
  }

  getAllFoodWithoutPagination() {
    return this.http.get<Food[]>(`${this.apiUrlService.getApiUrl()}/food`);
  }

  saveDiet(diet: Diet[]) {
    return this.http.post(`${this.apiUrlService.getApiUrl()}/diet`, diet);
  }

  getDates(userId: number) {
    return this.http.get<string[]>(
      `${this.apiUrlService.getApiUrl()}/diet/dates/${userId}`
    );
  }

  getDietByDateAndGuestId(guestId: number, date: string) {
    return this.http.get<DietResponse>(
      `${this.apiUrlService.getApiUrl()}/diet/${guestId}/${date}`
    );
  }

  deleteDiet(guestId: number, date: string) {
    return this.http.delete(
      `${this.apiUrlService.getApiUrl()}/diet/${guestId}/${date}`
    );
  }

  deleteFood(dietId: number, guestId: number) {
    return this.http.delete(
      `${this.apiUrlService.getApiUrl()}/diet/food/${dietId}/${guestId}`
    );
  }

  getDietById(dietId: number) {
    return this.http.get<Diet>(
      `${this.apiUrlService.getApiUrl()}/diet/${dietId}`
    );
  }

  getFoodById(foodId: number) {
    return this.http.get<Food>(
      `${this.apiUrlService.getApiUrl()}/food/${foodId}`
    );
  }

  updateDiet(data: DietUpdateRequest, dietId: number) {
    return this.http.put(
      `${this.apiUrlService.getApiUrl()}/diet/${dietId}`,
      data
    );
  }
  getMacronutrienseStatistics(guestUserId: number) {
    return this.http.get<DietSummary[]>(
      `${this.apiUrlService.getApiUrl()}/diet/macronutriense/${guestUserId}`
    );
  }
  getCalories(userId: number){
    return this.http.get<CaloriesSum>(`${this.apiUrlService.getApiUrl()}/diet/caloriesSum/${userId}`);
  }
  getMealFrequency(userId: number){
    return this.http.get<MealFrequency[]>(`${this.apiUrlService.getApiUrl()}/diet/mealFrequency/${userId}`);
  }
  getExerciseRegularity(userId: number){
    return this.http.get<ExerciseRegularity[]>(`${this.apiUrlService.getApiUrl()}/workout/exerciseRegularity/${userId}`);
  }
  getRecentlyUsedExercise(userId: number){
    return this.http.get<RecentlyUsedExercise[]>(`${this.apiUrlService.getApiUrl()}/workout/recentlyUsedExercise/${userId}`);
  }
  getAllDietByGuest(guestId: number){
    return this.http.get<CalendarEvent[]>(`${this.apiUrlService.getApiUrl()}/diet/getAllDietByGuestId/${guestId}`);
  }

  getAllTrainerGuestDiet(trainerId: number){
    return this.http.get<CalendarEvent[]>(`${this.apiUrlService.getApiUrl()}/diet/getAllTrainerGuestDiet/${trainerId}`);
  }
  setEated(dietId: number){
    return this.http.get(`${this.apiUrlService.getApiUrl()}/diet/setEated/${dietId}`, {observe: 'response'});
  }
}
