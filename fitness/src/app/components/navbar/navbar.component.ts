import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../model/User';
import { AuthService } from '../../service/auth.service';
import { UserService } from '../../service/user.service';
import { NotificationService } from 'src/app/service/notification.service';
import { Notification } from 'src/app/model/Notification';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  @Output() logoutEvent = new EventEmitter<void>();
  isSpecialRoute: boolean = false;
  toggleNotification: boolean = false;
  toggleProfileDropdown: boolean = false;
  auth?: User;
  notifications: Notification[] = [];
  profileImageSrc: string | null = null;

  constructor(
    private router: Router,
    public authService: AuthService,
    private userService: UserService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.getAuthData();
    this.userService.profilePicture$.subscribe((newProfilePictureUrl) => {
      this.getProfilePicture(newProfilePictureUrl);
    });
    this.notificationService.getNotificationSubject().subscribe((notification: Notification[]) =>{
      this.notifications = [...notification];
    });
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

  toggleNotificationFunc() {
    this.toggleNotification = !this.toggleNotification;
  }

  toggleProfileDropdownFunc() {
    this.toggleProfileDropdown = !this.toggleProfileDropdown;
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
}
