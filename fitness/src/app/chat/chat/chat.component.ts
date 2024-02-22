import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/model/User';
import { MessageDto } from 'src/app/model/dto/MessageDto';
import { UserDto } from 'src/app/model/dto/UserDto';
import { AuthService } from 'src/app/service/auth.service';
import { ChatService } from 'src/app/service/chat.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent {
  users: UserDto[] = [];
  user?: any;
  messages: MessageDto[] = [];
  senderUser?: User;
  message: string = '';
  searchInput: string = '';
  allUsers: UserDto[] = [];
  private chatSubscription?: Subscription;
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private chatService: ChatService
  ) {
    this.fetchAllUser();
  }

  ngOnInit() {
    this.chatSubscription = this.chatService
      .getMessages()
      .subscribe((response: MessageDto) => {
        this.messages.push(response);
      });
  }

  ngOnDestroy() {
    if (this.chatSubscription) {
      this.chatSubscription.unsubscribe();
    }
  }
  fetchAllUser() {
    const token = this.authService.getDecodedToken();
    this.userService.getAllUser(token.sub).subscribe((response: UserDto[]) => {
      this.users = [...response];
      this.allUsers = [...response];
      this.users.forEach((user) => {
        if (user.profilePictureName) {
          this.getProfilePicture(user.profilePictureName, user);
        }
      });
      this.allUsers.forEach((user) => {
        if (user.profilePictureName) {
          this.getProfilePicture(user.profilePictureName, user);
        }
      });
    });
  }

  getProfilePicture(imageName: string, user: UserDto | User) {
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

  chooseUser(user: UserDto) {
    if(user.lastMessage != ""){
     this.chatService.updateReaded(user.lastMessageId).subscribe(response =>{
      if(response.status == 200){
       this.fetchAllUser();
      }
     }, error => console.log(error));
    }
    this.user = user;
    this.loadMessages();
  }

  loadMessages() {
    if (this.user) {
      const token = this.authService.getDecodedToken();
      this.chatService
        .getAllMessage(token.sub as number, this.user.id)
        .subscribe((messages: MessageDto[]) => {
          const message = messages.find((item) => !item.readed);
          if (message != undefined) {
            this.chatService
              .updateReaded(message?.id as number)
              .subscribe((response) => {
                if (response.status === 200) {
                } else {
                  console.error(response);
                }
              });
          }
          this.messages = [...messages];
        });
    }
    this.fetchSenderUser();
  }

  fetchSenderUser() {
    this.authService.getAuthData().subscribe((response: User) => {
      this.senderUser = response;
      if (this.senderUser.profilePictureName) {
        this.getProfilePicture(
          this.senderUser.profilePictureName,
          this.senderUser
        );
      }
    });
  }

  sendMessage() {
    // Az időt most adjuk hozzá, itt azonosítási céllal
    const currentDateTime = new Date();
    const year = currentDateTime.getFullYear();
    const month = (currentDateTime.getMonth() + 1).toString().padStart(2, '0'); // Hónap 0-tól kezdődik, így adjunk hozzá 1-et és formázzuk két karakterre.
    const day = currentDateTime.getDate().toString().padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    if (this.senderUser) {
      const messageToSend: MessageDto = {
        message: this.message,
        dateTime: formattedDate,
        senderUserFirstName: '',
        senderUserLastName: '',
        receiverUserFirstName: '',
        receiverUserLastName: '',
        readed: false,
        senderUserId: this.senderUser?.id as number,
        receiverUserId: this.user.id as number,
      };
      if (this.senderUser?.guest) {
        messageToSend.senderUserFirstName = this.senderUser.guest.first_name;
        messageToSend.senderUserLastName = this.senderUser.guest.last_name;
      }
      if (this.senderUser?.trainer) {
        messageToSend.senderUserFirstName = this.senderUser.trainer.first_name;
        messageToSend.senderUserLastName = this.senderUser.trainer.last_name;
      }
      if (this.user.guest) {
        messageToSend.senderUserFirstName = this.user.guest.first_name;
        messageToSend.senderUserLastName = this.user.guest.last_name;
      }
      if (this.user.trainer) {
        messageToSend.senderUserFirstName = this.user.trainer.first_name;
        messageToSend.senderUserLastName = this.user.trainer.last_name;
      }
      this.messages.push(messageToSend);
      this.message = '';
      this.chatService.sendPrivateMessage(messageToSend);
    }
  }

  onSearch() {
    const query = this.searchInput.trim();

    if (query === '') {
      // Ha a keresési szöveg üres, visszaállítjuk az eredeti users tömböt
      this.users = this.allUsers.slice();
    } else {
      const filteredItems = this.users.filter((item: UserDto) =>
        this.matchesSearchQuery(item, query)
      );
      this.users = filteredItems;
    }
  }

  matchesSearchQuery(item: UserDto, query: string): boolean {
    const keywords = query
      .toLowerCase()
      .split(' ')
      .filter((keyword) => keyword.trim() !== '');

    return (
      keywords.every(
        (keyword) =>
          item.firstName.toLowerCase().includes(keyword) ||
          item.lastName.toLowerCase().includes(keyword)
      ) ||
      (item.firstName + ' ' + item.lastName)
        .toLowerCase()
        .includes(query.toLowerCase())
    );
  }
}
