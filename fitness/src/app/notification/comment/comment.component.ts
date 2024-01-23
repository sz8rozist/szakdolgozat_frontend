import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SocketFeedBackDto } from 'src/app/model/dto/SocketFeedbackDto';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css'],
})
export class CommentComponent {
  feedback: string = '';
  notificationId: any;
  constructor(
    private notificationService: NotificationService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.notificationId = params.get('id');
    });
  }

  onSubmit() {
    if (this.feedback != '') {
     const dtho: SocketFeedBackDto = {
      feedback: this.feedback
     };
     this.notificationService.sendFeedbackNotification(dtho, this.notificationId);
     this.feedback = "";
    }
  }
}
