import { Component, ElementRef, EventEmitter, Input, Renderer2, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  @Input() auth: any;
  @Output() logoutEvent = new EventEmitter<void>();
  isSpecialRoute: boolean = false;
  toggleNotification: boolean = false;
  toggleProfileDropdown: boolean = false;
  constructor(private router: Router, private renderer: Renderer2){}

  ngOnInit(){
    this.router.events.subscribe(
      (event: any) => {
        if (event instanceof NavigationEnd) {
          console.log(this.router.url);
          if(this.router.url === "/dashboard"){
            this.isSpecialRoute = true;
          }
        }
      }
    );
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

  onLogout(){
    this.logoutEvent.emit();
  }
}
