import { Component } from '@angular/core';
import { PrivateChatMessage } from 'src/app/model/PrivateChatMessage';
import { ChatService } from '../../service/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
 privateChatMessage: PrivateChatMessage = {
    senderUserId: 1, // A feladó azonosítója
    receiverUserId: 2, // A címzett azonosítója
    message: '',
    localDateTime: '',
  };

  messages: PrivateChatMessage[] = [];

  constructor(private chatService: ChatService) {
    
  }

  ngOnInit(){
    this.chatService.getMessages().subscribe((message: PrivateChatMessage) =>{
      console.log(message);
      this.messages.push(message);
    })
  }


  sendMessage(): void {
    // Az időt most adjuk hozzá, itt azonosítási céllal
    this.privateChatMessage.localDateTime = new Date().toLocaleTimeString();
    this.chatService.sendPrivateMessage(this.privateChatMessage);
  }
}
