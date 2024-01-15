import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { UserService } from 'src/app/service/user.service';
import { User } from 'src/app/model/User';
import { UserDto } from 'src/app/model/dto/UserDto';
import { TranslateService } from '@ngx-translate/core';

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
    private translateService: TranslateService){}

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
    this.userService.getAllUser().subscribe((response: UserDto[]) =>{
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
