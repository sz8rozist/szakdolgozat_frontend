import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './service/auth.service';
import { UserDto } from './model/dto/UserDto';
import { DietService } from './service/diet.service';
import { NgToastService } from 'ng-angular-popup';
import { NotificationModel } from './model/NotificationModel';
import { NotificationService } from './service/notification.service';
import { NotificationDto } from './model/dto/NotificationDto';
import { User } from './model/User';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'My Fitness';

  auth: any;
  user?: UserDto;
  notification?: NotificationDto[];

  constructor(private router: Router,
     public authService: AuthService,
      private notificationService: NotificationService,
       private toast: NgToastService) {}
  ngOnInit(){
   this.getTrainerNotification();
   this.getLastDietNotificationForTrainer();
  }

  onLogout(){
    this.authService.logout();
  }

  getUserToChatWindow(value: UserDto){
    this.user = value;
  }

  getTrainerNotification(){
    this.notificationService.getTrainerNotification().subscribe((response: NotificationModel) =>{
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

  getLastDietNotificationForTrainer(){
    const token = this.authService.getDecodedToken();
    const trainer = token.role.find((item: any) => item.role == "TRAINER");
    if(trainer){
      const authData = this.authService.getAuthData().toPromise();
      authData.then((response: any) =>{
        if(response){
          this.notificationService.getLastFiveDietNotificationForTrainer(response.trainer.id as number).subscribe((resp: NotificationDto[]) => {
            this.notification = resp.filter(obj => !obj.viewed);
          });
        }
      }, error => {console.log(error)});
    }
    
  }
}
