import { Component, Input } from '@angular/core';
import { Message } from 'src/app/model/Message';
import { PrivateChatMessage } from 'src/app/model/PrivateChatMessage';
import { User } from 'src/app/model/User';
import { UserResponse } from 'src/app/model/UserResponse';
import { AuthService } from 'src/app/service/auth.service';
import { ChatService } from 'src/app/service/chat.service';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css'],
})
export class ChatWindowComponent {
  showWindow: boolean = false;
  @Input() user: any;
  message: string = '';
  messages: any[] = [];
  senderUser?: UserResponse;
  constructor(
    private authService: AuthService,
    private chatService: ChatService
  ) {}

  ngOnChanges() {
    console.log(this.user);
    if (this.user) {
      this.showWindow = true;
    } else {
      this.showWindow = false;
    }
  }

  ngOnInit() {
    this.chatService.getMessages().subscribe((message: any) => {
      this.messages.push(message);
    });
    this.fetchSenderUser();
  }

  fetchSenderUser() {
    this.authService.getAuthData().subscribe((response: UserResponse) => {
      this.senderUser = response;
    });
  }

  closeWindow() {
    this.showWindow = false;
  }

  sendMessage() {
    // Az időt most adjuk hozzá, itt azonosítási céllal
    const currentDateTime = new Date();
    const year = currentDateTime.getFullYear();
    const month = (currentDateTime.getMonth() + 1).toString().padStart(2, '0'); // Hónap 0-tól kezdődik, így adjunk hozzá 1-et és formázzuk két karakterre.
    const day = currentDateTime.getDate().toString().padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    const token = this.authService.getDecodedToken();
    const data: PrivateChatMessage = {
      senderUserId: token.sub as number,
      receiverUserId: this.user.user.id,
      message: this.message,
      dateTime: formattedDate,
    };
    const d: Message = {
      message: this.message,
      dateTime: formattedDate,
      senderUser: undefined,
      receiverUser: undefined,
    };
    this.authService
      .getUserById(data.senderUserId)
      .subscribe((sender: UserResponse) => {
        d.senderUser = sender.user;
        this.authService
          .getUserById(data.receiverUserId)
          .subscribe((receiver: UserResponse) => {
            d.receiverUser = receiver.user;
            const messageToSend: Message = {
              message: d.message,
              dateTime: d.dateTime,
              senderUser: d.senderUser,
              receiverUser: d.receiverUser,
            };
            this.messages.push(messageToSend);
          });
      });
    this.chatService.sendPrivateMessage(data);
    this.message = '';
  }
}
