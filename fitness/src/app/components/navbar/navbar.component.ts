import { Component, EventEmitter,  Output } from '@angular/core';
import {  Router } from '@angular/router';
import { User } from 'src/app/model/User';
import { AuthService } from 'src/app/service/auth.service';

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
  constructor(private router: Router, public authService: AuthService){}

  ngOnInit(){
    const token = this.authService.getDecodedToken();
    console.log(token);
    this.authService.getUserById(token.sub).subscribe((response: User) =>{
      this.auth = response;
    })
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
}
