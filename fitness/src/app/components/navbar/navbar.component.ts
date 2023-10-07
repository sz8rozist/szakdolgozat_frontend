import { Component, ElementRef, Input, Renderer2 } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isSpecialRoute: boolean = false;
  toggleNotification: boolean = false;
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
}
