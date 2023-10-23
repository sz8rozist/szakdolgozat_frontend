import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { tap } from 'rxjs';
import { LoginResponse } from 'src/app/model/LoginResponse';
import { LoginUser } from 'src/app/model/LoginUser';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent {
  loginForm: FormGroup;
  constructor(private authService: AuthService, private toast: NgToastService, private router: Router) {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
    this.authService.isLoggedIn$.subscribe(resp =>{
      if(resp){
        this.router.navigate(["/dashboard"]);
      }
    })
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const loginUser: LoginUser = {
        username: this.loginForm.get('username')?.value,
        password: this.loginForm.get('password')?.value,
      };
      this.authService.login(loginUser).subscribe(
        (response: LoginResponse) => {
          if(response){
            this.toast.success({
              detail: 'Sikeres',
              summary: 'Sikeres bejelentkezés!',
              duration: 2000,
              type: 'success',
            });
              this.router.navigate(['/dashboard']);
          }
        },
        (error) => {
          this.toast.error({
            detail: 'Hiba',
            summary: error.error.message,
            duration: 3000,
            type: 'error',
          });
          console.log(error.error);
        }
      );

    }
  }
}
