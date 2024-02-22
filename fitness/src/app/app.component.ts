import { Component, HostListener } from '@angular/core';
import { AuthService } from './service/auth.service';
import { UserDto } from './model/dto/UserDto';
import { NgToastService } from 'ng-angular-popup';
import { NotificationService } from './service/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { Notification } from './model/Notification';
import { UserService } from './service/user.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'My Fitness';
  constructor(
    public authService: AuthService,
    private notificationService: NotificationService,
    private toast: NgToastService,
    private translateService: TranslateService,
    private userService: UserService
  ) {}
  ngOnInit() {
    this.getTrainerNotification();
    this.getTrainerWorkoutNotification();
    this.getFeedbackNotification();
    this.translateService.setDefaultLang('hu');
    this.translateService.use(localStorage.getItem('lang') || 'hu');
  }

  onLogout() {
    const token = this.authService.getDecodedToken();
    console.log(token.sub);

    this.userService.removeOnline(token.sub as number).subscribe(response =>{
      if(response.status == 200){
        console.log("sikeres setonline");
      }
    }, error => console.error(error));
    this.authService.logout();
    
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
