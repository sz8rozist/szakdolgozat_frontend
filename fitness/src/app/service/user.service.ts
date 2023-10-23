import { Injectable } from '@angular/core';
import { ApiUrlService } from './api-url.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private apiUrlService: ApiUrlService,
    private http: HttpClient) { }

  uploadFile(formData: FormData, userId: number){
    return this.http.post(`${this.apiUrlService.getApiUrl()}/user/image/${userId}`, formData,{responseType: 'text'});
  }

  getImage(imageName: string){
    return this.http.get(`${this.apiUrlService.getApiUrl()}/user/image/${imageName}`, {responseType: 'blob'});
  }

  deleteImage(userId: number){
    return this.http.delete(`${this.apiUrlService.getApiUrl()}/user/image/${userId}`);
  }
}
