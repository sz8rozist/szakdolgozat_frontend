import { Component } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { UserResponse } from '../../model/UserResponse';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  auth?: UserResponse;
  isEtrendVisible = false;
  isEdzesVisible = false;
  constructor(private authService: AuthService){}

  getAuthData(){
    this.authService.getAuthData().subscribe((response: UserResponse) =>{
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
