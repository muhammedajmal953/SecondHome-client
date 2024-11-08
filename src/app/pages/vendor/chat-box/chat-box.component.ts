import { Component, OnInit } from '@angular/core';
import { ChatComponent } from "../../../components/chat/chat.component";
import { ChatService } from '../../../services/chat.service';
import { Observable } from 'rxjs';
import { UserDoc } from '../../../models/IUsers';
import { Store } from '@ngrx/store';
import * as VendorSelector from '../../../state/vendor/vendor.selecters';
import * as VendorActions from '../../../state/vendor/vendor.actions';
import { IChat } from '../../../models/IChat';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';




@Component({
  selector: 'app-chat-box',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './chat-box.component.html',
  styleUrl: './chat-box.component.css'
})
export class ChatBoxComponent implements OnInit{
  vendor$!: Observable<UserDoc | null>;
  constructor(private _chatService: ChatService, private store: Store) {
    this.vendor$ = this.store.select(VendorSelector.selectVendor);
  }
  id!: string
  role:string='vendor'
  chats!: IChat[]
  messageContent:string=''
  messages!:IChat

  ngOnInit(): void {
    this.store.dispatch(VendorActions.loadVendor());

    this.vendor$.subscribe({
      next: (data) => {
        if (data) {
          this.id = data._id
          console.log(this.id);

        }
      },
      complete: () => { console.log('completed');
      }
    })
    this._chatService.getAllrooms(this.id, this.role).subscribe({
      next: (data: unknown) => {
        console.log(data);

        if (data) {
          console.log(data);

          this.chats=data as IChat[]
        }
      }
    })

    console.log('deedd',this.chats);

  }

  enterIntoChat(roomId: string) {
    this._chatService.joinRoom(roomId)
    this._chatService.loadMessage(roomId).subscribe({
      next: (msgs:IChat) => {
        this.messages=msgs
      },
      complete:()=>{}
    })
  }

  sendMessages(roomId:string) {
    // this._chatService.sendMessage(roomId,this.messages.vendorId,this.messageContent)
  }
}
