import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { UserService } from 'src/app/service/user.service';
import { User } from 'src/app/model/User';
import { UserDto } from 'src/app/model/dto/UserDto';
import { TranslateService } from '@ngx-translate/core';
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
  constructor(private authService: AuthService,
    private translateService: TranslateService){
      
    }

  getAuthData(){
    this.authService.getAuthData().subscribe((response: User) =>{
      this.auth = response;
    });
  }

  ngOnInit(){
    this.getAuthData();
  }

  toggleULVisibility() {
    this.isEtrendVisible = !this.isEtrendVisible;
  }

  toggleEdzesMenuVisible(){
    this.isEdzesVisible = !this.isEdzesVisible;
  }

  changeLang(lang: string){
    const selectedLanguage = lang;
    localStorage.setItem('lang', selectedLanguage);
    this.translateService.use(selectedLanguage);
  }

}
