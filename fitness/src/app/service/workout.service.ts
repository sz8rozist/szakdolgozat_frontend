import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiUrlService } from './api-url.service';
import { WorkoutRequest } from '../model/WorkoutRequest';
import { Workout } from '../model/Workout';
import { WorkoutUpdateRequest } from '../model/WorkoutUpdateRequest';

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {
  constructor(private http: HttpClient, private apiUrlService: ApiUrlService) {}

  saveWorkout(userId: number, date: string, data: WorkoutRequest[]){
    return this.http.post(`${this.apiUrlService.getApiUrl()}/workout/${userId}/${date}`,data);
  }

  getWorkouts(userId: number, date: string){
    return this.http.get<Workout[]>(`${this.apiUrlService.getApiUrl()}/workout/${userId}/${date}`);
  }

  getWorkoutByID(id: number) {
    return this.http.get<Workout>(`${this.apiUrlService.getApiUrl()}/workout/${id}`);
  }

  saveExerciseInWorkout(updateData: WorkoutUpdateRequest, workoutId: number){
    return this.http.put(`${this.apiUrlService.getApiUrl()}/workout/${workoutId}`, updateData);
  }

  deleteWorkout(guestId: number, date: string) {
    return this.http.delete(
      `${this.apiUrlService.getApiUrl()}/workout/${guestId}/${date}`
    );
  }

  trainerSaveWorkout(userId: number, date:string, guestId: number, data: WorkoutRequest[]){
    return this.http.post(`${this.apiUrlService.getApiUrl()}/workout/saveTrainer/${userId}/${guestId}/${date}`, data);
  }

  countTrainerWorkoutPlan(trainerId: number){
    return this.http.get<number>(`${this.apiUrlService.getApiUrl()}/workout/trainerWorkoutPlanCount/${trainerId}`);
  }
}
