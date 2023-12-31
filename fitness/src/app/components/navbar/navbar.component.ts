import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../model/User';
import { AuthService } from '../../service/auth.service';
import { UserService } from '../../service/user.service';
import { NotificationDto } from 'src/app/model/dto/NotificationDto';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  @Output() logoutEvent = new EventEmitter<void>();
  @Input() notification?: NotificationDto[];
  isSpecialRoute: boolean = false;
  toggleNotification: boolean = false;
  toggleProfileDropdown: boolean = false;
  toggleMessageDropdown: boolean = false;
  auth?: User;
  profileImageSrc: string | null = null;

  constructor(
    private router: Router,
    public authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.getAuthData();
    this.userService.profilePicture$.subscribe((newProfilePictureUrl) => {
      this.getProfilePicture(newProfilePictureUrl);
    });
  }
  ngOnChanges() {
    if(this.notification){
      console.log(this.notification);
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

  toggleNotificationFunc() {
    this.toggleNotification = !this.toggleNotification;
  }
  toggleProfileDropdownFunc() {
    this.toggleProfileDropdown = !this.toggleProfileDropdown;
  }

  toggleMessageDropdownFunc() {
    this.toggleMessageDropdown = !this.toggleMessageDropdown;
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
      this.getProfilePicture(response.profilePictureName);
    });
  }
}
