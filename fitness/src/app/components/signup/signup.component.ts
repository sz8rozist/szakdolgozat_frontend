import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { Role } from 'src/app/model/Role';
import { SignupUser } from 'src/app/model/SignupUser';
import { AuthService } from 'src/app/service/auth.service';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  signupForm: FormGroup;
  constructor(private authService: AuthService, private router: Router, private toast: NgToastService) {
    this.signupForm = new FormGroup({
      veznev: new FormControl('', [Validators.required]),
      kernev: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      role: new FormControl('', [Validators.required]),
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const signupUser: SignupUser = {
        username: this.signupForm.get('username')?.value,
        veznev: this.signupForm.get('veznev')?.value,
        kernev: this.signupForm.get('kernev')?.value,
        email: this.signupForm.get('email')?.value,
        role:
          this.signupForm.get('role')?.value == Role.Guest
            ? Role.Guest
            : Role.Trainer,
        password: this.signupForm.get('password')?.value,
      };

      this.authService.signup(signupUser).subscribe((response) => {
        const status = response.status;
        if(status === 201){
          this.toast.success({
            detail: 'Sikeres',
            summary: 'Sikeres regisztráció!',
            duration: 2000,
            type: 'success'
          });
          this.signupForm.reset();
        }
      },
      (error =>{
        this.toast.error({
          detail: 'Hiba',
          summary: error.error.message,
          duration: 2000,
          type: 'error',
        });
        this.signupForm.reset();
      }));
    }
  }
}
