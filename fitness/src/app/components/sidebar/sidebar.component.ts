import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { UserService } from 'src/app/service/user.service';
import { User } from 'src/app/model/User';
import { UserDto } from 'src/app/model/dto/UserDto';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ChatWindowComponent } from '../chat-window/chat-window.component';
import { ChatService } from 'src/app/service/chat.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  auth?: User;
  isEtrendVisible = false;
  isEdzesVisible = false;
  users: UserDto[] = [];
  @Output() chatWindow = new EventEmitter<UserDto>();
  constructor(private authService: AuthService,
    private userService: UserService,
    private translateService: TranslateService,
    private chatService: ChatService){
      this.chatService.messageRead$.subscribe((userId: String) =>{
        if(userId){
          const foundedUser = this.users.find((item) => item.id == Number(userId));
          if(foundedUser){
            foundedUser.lastMessage = "";
          }else{
            console.warn("Nem található user: " + userId);
          }
        }
      });
    }

  getAuthData(){
    this.authService.getAuthData().subscribe((response: User) =>{
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

  chooseUser(user: UserDto){
    this.chatWindow.emit(user);
  }

  fetchAllUser(){
    const token = this.authService.getDecodedToken();
    this.userService.getAllUser(token.sub).subscribe((response: UserDto[]) =>{
      console.log(response);
      this.users = [...response];
      this.users.forEach(user => {
        if (user.profilePictureName) {
          this.getProfilePicture(user.profilePictureName, user);
        }
      });
    });
  }

  getProfilePicture(imageName: string, user: UserDto) {
    if (imageName != null) {
      this.userService.getImage(imageName).subscribe((response) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          user.profilePictureName = e.target.result;
        };
        reader.readAsDataURL(response);
      });
    }
  }

  changeLang(lang: string){
    const selectedLanguage = lang;
    localStorage.setItem('lang', selectedLanguage);
    this.translateService.use(selectedLanguage);
  }

}
