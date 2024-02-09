import { Component, HostListener } from '@angular/core';
import { AuthService } from './service/auth.service';
import { UserDto } from './model/dto/UserDto';
import { NgToastService } from 'ng-angular-popup';
import { NotificationService } from './service/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { Notification } from './model/Notification';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'My Fitness';

  auth: any;
  user?: UserDto;

  constructor(
    public authService: AuthService,
    private notificationService: NotificationService,
    private toast: NgToastService,
    private translateService: TranslateService
  ) {}
  ngOnInit() {
    this.getTrainerNotification();
    this.getTrainerWorkoutNotification();
    this.getFeedbackNotification();
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
      .subscribe((response: Notification) => {
        setTimeout(() => {
          this.toast.info({
            detail: 'Értesítés',
            summary: response.message,
            duration: 2000,
            type: 'info',
          });
          this.notificationService.addNotification(response);
        }, 2500);
      });
  }

  getTrainerWorkoutNotification() {
    this.notificationService
      .getTrainerWorkoutNotification()
      .subscribe((response: Notification) => {
        setTimeout(() => {
          this.toast.info({
            detail: 'Értesítés',
            summary: response.message,
            duration: 2000,
            type: 'info',
          });
          this.notificationService.addNotification(response);
        }, 2500);
      });
  }

  getFeedbackNotification(){
    this.notificationService
    .getFeedbackNotification()
    .subscribe((response: Notification) => {
      setTimeout(() => {
        this.toast.info({
          detail: 'Értesítés',
          summary: response.message,
          duration: 2000,
          type: 'info',
        });
        this.notificationService.addNotification(response);
      }, 2500);
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event: Event) {
    console.log('Az oldal bezárásra kerül.');
    this.authService.rememberme$.subscribe((response: boolean) =>{
      if(!response){
       // localStorage.removeItem("token");
      }
    });
  }
}
