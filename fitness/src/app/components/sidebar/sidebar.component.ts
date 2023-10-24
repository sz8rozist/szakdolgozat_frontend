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
  isEtrendVisible = false;
  isEdzesVisible = false;
  constructor(private authService: AuthService){}

  getAuthData(){
    this.authService.getAuthData().subscribe((response: User) =>{
      this.auth = response;
    });
  }

  ngOnInit(){
    this.getAuthData();
  }

  toggleULVisibility() {
    this.isEtrendVisible = !this.isEtrendVisible;
  }

  toggleEdzesMenuVisible(){
    this.isEdzesVisible = !this.isEdzesVisible;
  }
}
