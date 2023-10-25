import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiUrlService } from './api-url.service';
import { Food } from '../model/Food';

@Injectable({
  providedIn: 'root'
})
export class DietService {

  constructor(private http: HttpClient, private apiUrlService: ApiUrlService) { }

  createFood(food: Food){
    return this.http.post<Food>(`${this.apiUrlService.getApiUrl()}/food`, food);
  }

  getAllFood(){
    return this.http.get<Food[]>(`${this.apiUrlService.getApiUrl()}/food`);
  }
}
