import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgToastService } from 'ng-angular-popup';
import { LoginResponse } from 'src/app/model/LoginResponse';
import { LoginUser } from 'src/app/model/LoginUser';
import { AuthService } from 'src/app/service/auth.service';
import { NotificationService } from 'src/app/service/notification.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent {
  loginForm: FormGroup;
  lang: string;
  constructor(
    private authService: AuthService,
    private toast: NgToastService,
    private router: Router,
    private translateService: TranslateService,
    private notificationService: NotificationService,
    private userService: UserService
  ) {
    this.lang = localStorage.getItem('lang') || 'hu';
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      rememberme: new FormControl('')
    });
    this.authService.isLoggedIn$.subscribe((resp) => {
      if (resp) {
        this.router.navigate(['/dashboard']);
      }
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.get('rememberme')?.value);
      const loginUser: LoginUser = {
        username: this.loginForm.get('username')?.value,
        password: this.loginForm.get('password')?.value,
      };
      this.authService.login(loginUser).subscribe(
        (response: LoginResponse) => {
          if (response) {
            this.toast.success({
              detail: 'Sikeres',
              summary: 'Sikeres bejelentkezés!',
              duration: 2000,
              type: 'success',
            });
            if(this.loginForm.get('rememberme')?.value){
              this.authService.addRememberme(this.loginForm.get('rememberme')?.value);
            }
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

  changeLang(lang: any) {
    const selectedLanguage = lang.target.value;
    localStorage.setItem('lang', selectedLanguage);
    this.translateService.use(selectedLanguage);
  }
}
