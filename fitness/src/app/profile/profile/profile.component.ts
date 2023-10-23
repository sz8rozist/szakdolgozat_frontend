import { Component } from '@angular/core';
import { Guest } from 'src/app/model/Guest';
import { Trainer } from 'src/app/model/Trainer';
import { User } from 'src/app/model/User';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  activeTab: string = 'overview';
  user?: User;
  trainer?: Trainer;
  guest?: Guest

  constructor(
    private authService: AuthService,
  ){}

  ngOnInit(){
    this.authService.getAuthData().subscribe((response: User) =>{
      if(response){
        this.user = response;
        if(this.user.trainer != null){
          this.trainer = this.user.trainer;
        }else{
          this.guest = this.user.guest;
        }
      }
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}
