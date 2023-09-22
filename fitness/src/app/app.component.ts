import { Component } from '@angular/core';
import { ActivatedRoute, Route, Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'fitness';
  isSpecialRoute: boolean = false;

  constructor(private router: Router) {}
  ngOnInit(){
    this.router.events.subscribe(
      (event: any) => {
        if (event instanceof NavigationEnd) {
          if(this.router.url === "/signin" || this.router.url === "/signup"){
            this.isSpecialRoute = true;
          }
        }
      }
    );
  }
}
