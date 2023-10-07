import { Injectable } from '@angular/core';
import { ApiUrlService } from './api-url.service';
import { HttpClient } from '@angular/common/http';
import { LoginUser } from '../model/LoginUser';
import { LoginResponse } from '../model/LoginResponse';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private apiUrlService: ApiUrlService, private http: HttpClient, private jwtHelper: JwtHelperService, private router: Router) {}

  login(loginUser: LoginUser) {
    return this.http.post<LoginResponse>(`${this.apiUrlService.getApiUrl()}/user/login`, loginUser);
  }

  isAuthenticated() {
    const token = localStorage.getItem('token');
    if (token) {
      return token && !this.jwtHelper.isTokenExpired(token);
    }
    return false;
  }

  getDecodedToken() {
    const token = localStorage.getItem('token');
    if(token){
      return this.jwtHelper.decodeToken(token as string);
    }
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/signin']);
  }
}
