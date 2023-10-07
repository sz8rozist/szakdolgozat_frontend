import { Injectable } from '@angular/core';
import { ApiUrlService } from './api-url.service';
import { HttpClient } from '@angular/common/http';
import { LoginUser } from '../model/LoginUser';
import { LoginResponse } from '../model/LoginResponse';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private apiUrlService: ApiUrlService, private http: HttpClient) {}

  login(loginUser: LoginUser) {
    return this.http.post<LoginResponse>(`${this.apiUrlService.getApiUrl()}/user/login`, loginUser);
  }
}
