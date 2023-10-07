import { Component } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  constructor(
    private authService: AuthService
  ){};

  ngOnInit(){
    console.log(this.authService.isAuthenticated());
    console.log(this.authService.getDecodedToken());
  }
}
