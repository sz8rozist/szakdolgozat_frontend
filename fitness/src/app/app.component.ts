import { Component } from '@angular/core';
import { ActivatedRoute, Route, Router, NavigationEnd } from '@angular/router';
import { AuthService } from './service/auth.service';
import { User } from './model/User';
import { UserDto } from './model/dto/UserDto';
import { DietService } from './service/diet.service';
import { SocketDietDto } from './model/dto/SocketDietDto';
import { NgToastModule, NgToastService } from 'ng-angular-popup';

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
    this.dietService.getTrainerNotification().subscribe((response: SocketDietDto) =>{
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
