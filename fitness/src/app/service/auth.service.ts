import { Injectable } from '@angular/core';
import { ApiUrlService } from './api-url.service';
import { HttpClient } from '@angular/common/http';
import { LoginUser } from '../model/LoginUser';
import { LoginResponse } from '../model/LoginResponse';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { SignupUser } from '../model/SignupUser';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private apiUrlService: ApiUrlService, private http: HttpClient, private jwtHelper: JwtHelperService, private router: Router) {}

  login(loginUser: LoginUser) {
    return this.http.post<LoginResponse>(`${this.apiUrlService.getApiUrl()}/user/login`, loginUser);
  }

  signup(signupUser: SignupUser){
    return this.http.post(`${this.apiUrlService.getApiUrl()}/user/register`, signupUser,{observe: 'response'});
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

  isTokenExpired(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      return true; // Nincs token
    }
    const tokenData = JSON.parse(atob(token.split('.')[1]));
    const expirationDate = new Date(tokenData.exp * 1000); // Konvertálás ms-re
    console.log(expirationDate);
    console.log(expirationDate.getMinutes(), new Date().getMinutes());
    return expirationDate.getTime() <= new Date().getTime(); // Ellenőrzés, hogy a token lejárt-e
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/signin']);
  }
}
