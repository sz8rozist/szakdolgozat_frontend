import { Component } from '@angular/core';
import { ActivatedRoute, Route, Router, NavigationEnd } from '@angular/router';
import { AuthService } from './service/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'My Fitness';
  isSpecialRoute: boolean = false;
  isAuthenticated: any;

  auth: any;

  constructor(private router: Router, private authService: AuthService) {}
  ngOnInit(){
    this.router.events.subscribe(
      (event: any) => {
        if (event instanceof NavigationEnd) {
          if(this.router.url === "/dashboard"){
            this.isSpecialRoute = true;
          }
        }
      }
    );
    this.isAuthenticated = this.authService.isAuthenticated();
    this.auth = this.authService.getDecodedToken();
  }

  onLogout(){
    this.authService.logout();
  }
}
