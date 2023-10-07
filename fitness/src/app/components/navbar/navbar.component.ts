import { Component, Input } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isSpecialRoute: boolean = false;
  constructor(private router: Router){}

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
}
