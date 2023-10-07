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
          console.log(this.router.url);
          if(this.router.url === "/dashboard"){
            this.isSpecialRoute = true;
          }
        }
      }
    );
  }
}
