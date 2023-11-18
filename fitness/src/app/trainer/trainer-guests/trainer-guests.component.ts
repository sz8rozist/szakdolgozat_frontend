import { Component } from '@angular/core';
import { User } from 'src/app/model/User';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-trainer-guests',
  templateUrl: './trainer-guests.component.html',
  styleUrls: ['./trainer-guests.component.css']
})
export class TrainerGuestsComponent {
  constructor(
    private authService: AuthService
  ){}

  ngOnInit(){
    this.authService.getAuthData().subscribe((response: User) =>{
      console.log(response);
    })
  }
}
