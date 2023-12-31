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
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'My Fitness';

  auth: any;
  user?: UserDto;
  notification?: NotificationDto[];

  constructor(
    public authService: AuthService,
    private notificationService: NotificationService,
    private toast: NgToastService,
    private translateService: TranslateService
  ) {}
  ngOnInit() {
    this.getTrainerNotification();
    this.getLastDietNotificationForTrainer();
    this.translateService.setDefaultLang('hu');
    this.translateService.use(localStorage.getItem('lang') || 'hu');
  }

  onLogout() {
    this.authService.logout();
  }

  getUserToChatWindow(value: UserDto) {
    this.user = value;
  }

  getTrainerNotification() {
    this.notificationService
      .getTrainerNotification()
      .subscribe((response: NotificationModel) => {
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

  getLastDietNotificationForTrainer() {
    const authData = this.authService.getAuthData().toPromise();
    authData.then(
      (response: any) => {
        if (response.trainer != null) {
          this.notificationService
            .getLastFiveDietNotificationForTrainer(
              response.trainer.id as number
            )
            .subscribe((resp: NotificationDto[]) => {
              this.notification = resp.filter((obj) => !obj.viewed);
            });
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
