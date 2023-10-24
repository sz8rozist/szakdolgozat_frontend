import { Component } from '@angular/core';
import { User } from 'src/app/model/User';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  auth?: User;

  constructor(private authService: AuthService){}

  getAuthData(){
    this.authService.getAuthData().subscribe((response: User) =>{
      console.log(response);
      this.auth = response;
    });
  }

  ngOnInit(){
    this.getAuthData();
  }
}
