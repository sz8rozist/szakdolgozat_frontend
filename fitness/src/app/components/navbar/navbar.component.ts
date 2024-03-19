import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { User } from '../../model/User';
import { AuthService } from '../../service/auth.service';
import { UserService } from '../../service/user.service';
import { NotificationService } from 'src/app/service/notification.service';
import { Notification } from 'src/app/model/Notification';
import { OffcanvasComponent } from '../offcanvas/offcanvas.component';
import { TranslateService } from '@ngx-translate/core';
import { faBackwardStep } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  @Output() logoutEvent = new EventEmitter<void>();
  isSpecialRoute: boolean = false;
  auth?: User;
  notifications: Notification[] = [];
  profileImageSrc: string | null = null;
  faBack = faBackwardStep
  lang?: string;
  @ViewChild('canvasRef') canvasRef!: OffcanvasComponent;

  constructor(
    public authService: AuthService,
    private userService: UserService,
    private notificationService: NotificationService,
    private translateService: TranslateService,
  ) {}

  ngOnInit() {
    this.getAuthData();
    this.userService.profilePicture$.subscribe((newProfilePictureUrl) => {
      this.getProfilePicture(newProfilePictureUrl);
    });
    this.notificationService.getNotificationSubject().subscribe((notification: Notification[]) =>{
      const filter = notification.filter((elem) => !elem.viewed);
      this.notifications = [...filter];
    });

    const lang = localStorage.getItem('lang');
    if(lang){
      this.lang = lang;
    }
  }


  toggleSideBar() {
    const body = document.querySelector('body');
    if (body) {
      if (body.classList.contains('toggle-sidebar')) {
        body.classList.remove('toggle-sidebar');
      } else {
        body.classList.add('toggle-sidebar');
      }
    }
  }

  openNotificationOffCanvas() {
    this.canvasRef.openCanvas();
  }

  closeNotificationOffCanvas(){
    this.canvasRef.closeCanvas();
  }

  
  onLogout() {
    this.logoutEvent.emit();
  }

  getProfilePicture(imageName: string | null) {
    if (imageName != null) {
      this.userService.getImage(imageName).subscribe((response) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.profileImageSrc = e.target.result;
        };
        reader.readAsDataURL(response);
      });
    } else {
      this.profileImageSrc = imageName;
    }
  }

  getAuthData() {
    this.authService.getAuthData().subscribe((response: User) => {
      this.auth = response;
      this.notificationService.getAll(response.id as number).subscribe((data: Notification[]) =>{
        this.notificationService.setNotificationSubject(data);
      });
      this.getProfilePicture(response.profilePictureName);
    });
  }

  changeLang(lang: string){
    const selectedLanguage = lang;
    this.lang = lang;
    localStorage.setItem('lang', selectedLanguage);
    this.translateService.use(selectedLanguage);
  }
}
