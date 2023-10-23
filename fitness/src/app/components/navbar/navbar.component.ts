import { Component, EventEmitter,  Output } from '@angular/core';
import {  Router } from '@angular/router';
import { User } from 'src/app/model/User';
import { AuthService } from 'src/app/service/auth.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  @Output() logoutEvent = new EventEmitter<void>();
  isSpecialRoute: boolean = false;
  toggleNotification: boolean = false;
  toggleProfileDropdown: boolean = false;
  toggleMessageDropdown: boolean = false;
  auth?: User;
  profileImageSrc?: string;

  constructor(private router: Router, public authService: AuthService, private userService: UserService){}

  ngOnInit(){
   this.getAuthData();
  }
  toggleSideBar(){
    const body = document.querySelector('body');
    if (body) {
      if (body.classList.contains('toggle-sidebar')) {
        body.classList.remove('toggle-sidebar');
      } else {
        body.classList.add('toggle-sidebar');
      }
    }
  }

  toggleNotificationFunc(){
    this.toggleNotification = !this.toggleNotification;
  }
  toggleProfileDropdownFunc(){
    this.toggleProfileDropdown = !this.toggleProfileDropdown;
  }

  toggleMessageDropdownFunc(){
    this.toggleMessageDropdown = !this.toggleMessageDropdown;
  }

  onLogout(){
    this.logoutEvent.emit();
  }

  getProfilePicture(imageName: string) {
    if(imageName != null){
      this.userService.getImage(imageName).subscribe((response) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.profileImageSrc = e.target.result;
        };
        reader.readAsDataURL(response);
      });
    }
  }

  getAuthData(){
    this.authService.getAuthData().subscribe((response: User) =>{
      this.auth = response;
      this.getProfilePicture(response.profilePictureName);
    });
  }
}
