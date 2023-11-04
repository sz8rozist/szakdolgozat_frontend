import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiUrlService } from './api-url.service';
import { Exercise } from '../model/Exercise';

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {

  constructor(private http: HttpClient, private apiUrlService: ApiUrlService) {}

  getAllExercise(offset: number, pageSize: number) {
    return this.http.get<Exercise[]>(
      `${this.apiUrlService.getApiUrl()}/exercise/${offset}/${pageSize}`
    );
  }

  saveExercise(exercise: Exercise) {
    return this.http.post<Exercise>(`${this.apiUrlService.getApiUrl()}/exercise`, exercise);
  }

  getAllExerciseWithoutPagination(){
    return this.http.get<Exercise[]>(`${this.apiUrlService.getApiUrl()}/exercise`);
  }
  deleteExercise(workoutId: number, guestId: number) {
    return this.http.delete(
      `${this.apiUrlService.getApiUrl()}/exercise/${workoutId}/${guestId}`
    );
  }
}
