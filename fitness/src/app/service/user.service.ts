import { Injectable } from '@angular/core';
import { ApiUrlService } from './api-url.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private apiUrlService: ApiUrlService,
    private http: HttpClient) { }

  uploadFile(formData: FormData){
    return this.http.post<string>(`${this.apiUrlService.getApiUrl()}/user/image`, formData);
  }
}
