import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { AuthService } from '../service/auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {
  constructor(
    private authService: AuthService,
    private router: Router
  ){}
  canActivate(): Observable<boolean> {
      return this.authService.isLoggedIn$.pipe(
        tap((response) =>{
          if(!response){
            this.router.navigate(["/signin"]);
            return false;
          }
          return true;
        })
      );
  }
  
}