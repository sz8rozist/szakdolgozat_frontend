import { Injectable } from '@angular/core';
import { ApiUrlService } from './api-url.service';
import { HttpClient } from '@angular/common/http';
import { LoginUser } from '../model/LoginUser';
import { LoginResponse } from '../model/LoginResponse';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { SignupUser } from '../model/SignupUser';
import { BehaviorSubject, Observable, tap, throwError } from 'rxjs';
import { User } from '../model/User';
import { ChangePassword } from '../model/ChangePassword';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this._isLoggedIn$.asObservable();
  constructor(private apiUrlService: ApiUrlService, private http: HttpClient, private jwtHelper: JwtHelperService, private router: Router) {
    const token = localStorage.getItem('token');
    this._isLoggedIn$.next(!!token);
  }

  login(loginUser: LoginUser) {
    return this.http.post<LoginResponse>(`${this.apiUrlService.getApiUrl()}/user/login`, loginUser).pipe(
      tap((response: LoginResponse) =>{
        this._isLoggedIn$.next(true);
        localStorage.setItem("token", response.token);
      })
    );
  }

  signup(signupUser: SignupUser){
    return this.http.post(`${this.apiUrlService.getApiUrl()}/user/register`, signupUser,{observe: 'response'});
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
    this._isLoggedIn$.next(false);
  }

  getUserById(userId: number){
    return this.http.get<User>(`${this.apiUrlService.getApiUrl()}/user/${userId}`);
  }

  getAuthData(): Observable<User>{
    const token = this.getDecodedToken();
    if(token){
      return this.getUserById(token.sub);
    }
    return throwError('Nincs bejelentkezve felhasználó: Nincs érvényes token!');
  }

  checkPassword(userId: number, password: ChangePassword){
   return this.http.post<boolean>(`${this.apiUrlService.getApiUrl()}/user/password/${userId}`, password, {observe: 'response'}); 
  }

  isTrainer(){
    const token = this.getDecodedToken();
    if(token && token.role && Array.isArray(token.role)){
      return token.role.some((item: any) => item.role === "TRAINER");
    }
    return throwError("Nincs bejelentkezve felhasználó: Nincs érvényes token!");
  }
}
