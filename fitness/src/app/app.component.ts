import { Component } from '@angular/core';
import { ActivatedRoute, Route, Router, NavigationEnd } from '@angular/router';
import { AuthService } from './service/auth.service';
import { User } from './model/User';
import { UserDto } from './model/dto/UserDto';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'My Fitness';

  auth: any;
  user?: UserDto;

  constructor(private router: Router, public authService: AuthService) {}
  ngOnInit(){
   
  }

  onLogout(){
    this.authService.logout();
  }

  getUserToChatWindow(value: UserDto){
    this.user = value;
  }
}
