import { Component, HostListener } from '@angular/core';
import { Notification } from 'src/app/model/Notification';
import { AuthService } from 'src/app/service/auth.service';
import { NotificationService } from 'src/app/service/notification.service';
import {
  faBookOpenReader,
  faComment,
  faDumbbell,
  faFish,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { NgToastService } from 'ng-angular-popup';
import { trigger, style, animate, transition } from '@angular/animations';
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(5px)' }),
        animate(
          '500ms ease-in-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
  ],
})
export class NotificationComponent {
  page = 1;
  pageSize = 15;
  loading = false;
  notifications: Notification[] = [];
  faDiet = faFish;
  faFeedback = faComment;
  faExercise = faDumbbell;
  faRead = faBookOpenReader;
  faTrash = faTrashCan;
  totalPages?: number;
  displayNotifications: Notification[] = [];
  constructor(
    private notificationService: NotificationService,
    private authService: AuthService,
    private toast: NgToastService
  ) {}

  ngOnInit() {
    this.loadNotifications();
  }

  onDelete(id: number) {
    this.notificationService.delete(id).subscribe((response) => {
      if (response.status == 204) {
        this.toast.success({
          detail: 'Sikeres',
          summary: 'Sikeres törlés!',
          duration: 2000,
          type: 'success',
        });
        // Töröld az értesítést mindkét tömbből
        this.notifications = this.notifications.filter(
          (notification) => notification.notificationId !== id
        );
        this.displayNotifications = this.displayNotifications.filter(
          (notification) => notification.notificationId !== id
        );
        this.notificationService.setNotificationSubject(this.notifications);
      } else {
        console.error('Sikertelen törlés: ' + id);
      }
    });
  }

  markAsViewed(id: number) {
    this.notificationService.markAsViewed(id).subscribe((response) => {
      if (response.status == 204) {
        this.toast.success({
          detail: 'Sikeres',
          summary: 'Sikeres módosítás!',
          duration: 2000,
          type: 'success',
        });
        const notification = this.notifications.find(
          (elem) => elem.notificationId == id
        );
        if (notification) {
          notification.viewed = true;
        }

        const displayedNotification = this.displayNotifications.find((elem) => elem.notificationId == id);
        if(displayedNotification){
          displayedNotification.viewed = true;
        }
        
        this.notificationService.setNotificationSubject(this.notifications);
      } else {
        console.error('Sikertelen frissítés: ' + id);
      }
    });
  }

  markAllAsViewed() {
    const token = this.authService.getDecodedToken();
    this.notificationService
      .markAllAsViewed(token.sub)
      .subscribe((response) => {
        if (response.status == 204) {
          this.toast.success({
            detail: 'Sikeres',
            summary: 'Az összes üzenet olvasottra tétele sikeres!',
            duration: 2000,
            type: 'success',
          });
          // Minden elem viewed értékét true-ra állítjuk
          this.notifications.forEach((notification) => {
            notification.viewed = true;
          });

          this.notificationService.setNotificationSubject(this.notifications);
        }
      });
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    const windowHeight =
      'innerHeight' in window
        ? window.innerHeight
        : document.documentElement.offsetHeight;
    const body = document.body,
      html = document.documentElement;
    const docHeight = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );
    const windowBottom = windowHeight + window.pageYOffset;

    if (windowBottom >= docHeight && !this.loading) {
      if (this.totalPages && this.page < this.totalPages) {
        this.page++;
        this.updatePageData();
      }
    }
  }

  loadNotifications(): void {
    this.loading = true;
    this.notifications = [];
    this.notificationService.getNotificationSubject().subscribe(
      (response: Notification[]) => {
        console.log(response, this.notifications);
        this.notifications = [...response];
        this.totalPages = Math.ceil(response.length / this.pageSize);
        this.updatePageData();
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching notifications:', error);
        this.loading = false;
      }
    );
  }

  updatePageData(): void {
    const startIndex = (this.page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    const newNotifications = this.notifications.slice(startIndex, endIndex);

    if (this.page === 1) {
      this.displayNotifications = [...newNotifications];
    } else {
      // Ha már voltak korábbi értesítések, akkor csak az újakat adja hozzá
      this.displayNotifications = [...this.displayNotifications, ...newNotifications];
    }
  }
}
