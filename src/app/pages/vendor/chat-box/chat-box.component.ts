import { Component, OnInit } from '@angular/core';
import { ChatComponent } from '../../../components/chat/chat.component';
import { ChatService } from '../../../services/chat.service';
import { Observable } from 'rxjs';
import { UserDoc } from '../../../models/IUsers';
import { Store } from '@ngrx/store';
import * as VendorSelector from '../../../state/vendor/vendor.selecters';
import * as VendorActions from '../../../state/vendor/vendor.actions';
import { IChat, IChatResponse } from '../../../models/IChat';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-box',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat-box.component.html',
  styleUrl: './chat-box.component.css',
})
export class ChatBoxComponent implements OnInit {
  vendor$!: Observable<UserDoc | null>;
  constructor(private _chatService: ChatService, private store: Store) {
    this.vendor$ = this.store.select(VendorSelector.selectVendor);
  }
  id!: string;
  role: string = 'vendor';
  chats!: IChat[];
  messageContent: string = '';
  messages!: IChat;
  vendor!: UserDoc;
  user$!:UserDoc

  ngOnInit(): void {
    this.store.dispatch(VendorActions.loadVendor());

    this.vendor$.subscribe({
      next: (data) => {
        if (data) {
          this.id = data._id;
          this.vendor = data;
        }
      },
      complete: () => {
        console.log('completed');
      },
    });
    this._chatService.getAllrooms(this.id, this.role).subscribe(
      (data) => {
        this.chats = data;
        console.log(data);
      },
      (error) => {
        console.error('Error receiving rooms:', error);
      },
      () => {
        console.log('Completed subscription');
      }
    );
  }

  enterIntoChat(roomId: string,user:UserDoc) {
    console.log('CHAT CLICKED');
    this.user$=user

    this._chatService.joinRoom(roomId);
    this._chatService.loadMessage(roomId).subscribe({
      next: (msgs: IChatResponse) => {
        this.messages = msgs.chat;
        console.log(this.messages.messages.length);
        this.vendor=this.vendor
      },
      complete: () => {
        console.log('entered to chat');
      },
    });
    this._chatService.recieveMessages().subscribe((msg: unknown) => {
      this.messages.messages.push(msg as { time: Date; sender: string; content: string; })
    })
  }

  sendMessages() {
    this._chatService.sendMessage(
      this.messages.roomId,
      this.messages.vendorId,
      this.messageContent,
      this.messages.userId,
      this.messages.vendorId
    );
    this.messageContent=''
  }
}
