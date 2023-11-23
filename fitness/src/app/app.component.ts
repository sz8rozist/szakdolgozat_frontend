import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './service/auth.service';
import { UserDto } from './model/dto/UserDto';
import { DietService } from './service/diet.service';
import { NgToastService } from 'ng-angular-popup';
import { NotificationModel } from './model/NotificationModel';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'My Fitness';

  auth: any;
  user?: UserDto;

  constructor(private router: Router, public authService: AuthService, private dietService: DietService, private toast: NgToastService) {}
  ngOnInit(){
   this.getTrainerNotification();
  }

  onLogout(){
    this.authService.logout();
  }

  getUserToChatWindow(value: UserDto){
    this.user = value;
  }

  getTrainerNotification(){
    this.dietService.getTrainerNotification().subscribe((response: NotificationModel) =>{
      console.log(response);
      setTimeout(() => {
        this.toast.info({
          detail: 'Értesítés',
          summary: response.message,
          duration: 2000,
          type: 'info',
        });
      }, 2500);
    });
  }
}
