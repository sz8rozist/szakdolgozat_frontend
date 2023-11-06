import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { UserResponse } from '../../model/UserResponse';
import { UserService } from 'src/app/service/user.service';
import { User } from 'src/app/model/User';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  auth?: UserResponse;
  isEtrendVisible = false;
  isEdzesVisible = false;
  users: UserResponse[] = [];
  @Output() chatWindow = new EventEmitter<UserResponse>();
  constructor(private authService: AuthService,
    private userService: UserService){}

  getAuthData(){
    this.authService.getAuthData().subscribe((response: UserResponse) =>{
      this.auth = response;
    });
  }

  ngOnInit(){
    this.getAuthData();
    this.fetchAllUser();
  }

  toggleULVisibility() {
    this.isEtrendVisible = !this.isEtrendVisible;
  }

  toggleEdzesMenuVisible(){
    this.isEdzesVisible = !this.isEdzesVisible;
  }

  chooseUser(user: UserResponse){
    this.chatWindow.emit(user);
  }

  fetchAllUser(){
    this.userService.getAllUser().subscribe((response: UserResponse[]) =>{
      console.log(response);
      this.users = [...response];
      this.users.forEach(user => {
        if (user.user.profilePictureName) {
          this.getProfilePicture(user.user.profilePictureName, user);
        }
      });
    });
  }

  getProfilePicture(imageName: string, user: UserResponse) {
    if (imageName != null) {
      this.userService.getImage(imageName).subscribe((response) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          user.user.profilePictureName = e.target.result;
        };
        reader.readAsDataURL(response);
      });
    }
  }

}
