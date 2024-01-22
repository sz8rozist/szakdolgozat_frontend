import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from 'src/app/model/User';
import { MessageDto } from 'src/app/model/dto/MessageDto';
import { AuthService } from 'src/app/service/auth.service';
import { ChatService } from 'src/app/service/chat.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css'],
})
export class ChatWindowComponent {
  showWindow: boolean = false;
  @Input() user: any;
  @Output() messageRead = new EventEmitter<number>();
  message: string = '';
  messages: MessageDto[] = [];
  senderUser?: User;
  constructor(
    private authService: AuthService,
    private chatService: ChatService,
    private userService: UserService
  ) {}

  ngOnChanges() {
    if (this.user) {
      this.showWindow = true;
      const token = this.authService.getDecodedToken();
      this.chatService.getAllMessage(token.sub as number, this.user.id).subscribe((messages: MessageDto[]) =>{
        const message = messages.find((item) => !item.readed);
        this.chatService.updateReaded(message?.id as number).subscribe(response =>{
          if(response.status === 200){
            this.chatService.updateMessageRead(this.user.id);
          }else{
            console.error(response);
          }
        });
        this.messages = [...messages];
      })
    } else {
      this.showWindow = false;
    }
  }

  ngOnInit() {
    this.chatService.getMessages().subscribe((message: MessageDto) => {
      this.messages.push(message);
    });
    this.fetchSenderUser();
  }

  fetchSenderUser() {
    this.authService.getAuthData().subscribe((response: User) => {
      this.senderUser = response;
      if (this.senderUser.profilePictureName) {
        this.getProfilePicture(this.senderUser.profilePictureName, this.senderUser);
      }
    });
  }

  getProfilePicture(imageName: string, user: User) {
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
   
    const messageToSend: MessageDto = {
      message: this.message,
      dateTime: formattedDate,
      senderUserFirstName: "",
      senderUserLastName: "",
      receiverUserFirstName: "",
      receiverUserLastName: "",
      readed: false,
      senderUserId: this.senderUser?.id as number,
      receiverUserId: this.user.id as number,
    };
    if(this.senderUser?.guest){
      messageToSend.senderUserFirstName = this.senderUser.guest.first_name;
      messageToSend.senderUserLastName = this.senderUser.guest.last_name;
    }
    if(this.senderUser?.trainer){
      messageToSend.senderUserFirstName = this.senderUser.trainer.first_name;
      messageToSend.senderUserLastName = this.senderUser.trainer.last_name;
    }
    if(this.user.guest){
      messageToSend.senderUserFirstName = this.user.guest.first_name;
      messageToSend.senderUserLastName = this.user.guest.last_name;
    }
    if(this.user.trainer){
      messageToSend.senderUserFirstName = this.user.trainer.first_name;
      messageToSend.senderUserLastName = this.user.trainer.last_name;
    }
    console.log(messageToSend);
    this.messages.push(messageToSend);
    this.message = '';
    this.chatService.sendPrivateMessage(messageToSend);
  }
}
