import { Component, OnInit } from '@angular/core';
import { ChatComponent } from "../../../components/chat/chat.component";
import { ChatService } from '../../../services/chat.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UserDoc } from '../../../models/IUsers';
import * as UserActions from '../../../state/user/user.actions';
import * as UserSelectors from '../../../state/user/user.selector';
import { Icon } from 'leaflet';
import { IChat } from '../../../models/IChat';
import { channel } from 'diagnostics_channel';
import { ActivatedRoute } from '@angular/router';
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
  user$!: Observable<UserDoc | null>
  user!: UserDoc | null
  messages!: IChat
  vendorId!: string
  roomId!: string
  messageContent!:string
  constructor(private _chatService: ChatService, private _store: Store,private _activeRoute:ActivatedRoute) {

  }

  ngOnInit(): void {
    this._activeRoute.params.subscribe((params) => {
      this.vendorId = params['vendorId']
    })
    this._store.dispatch(UserActions.loadUserActions())
    this.user$ = this._store.select(UserSelectors.selectUser)




    this.user$.subscribe({
      next: (data) => {
        this.user=data
      },
      complete:()=>{}
    })
    console.log('vendor id',this.vendorId);
    console.log('userid id',this.user?._id!);

    this.roomId=`${this.user?._id}-${this.vendorId}`

    this._chatService.joinRoom(this.roomId)

    this._chatService.loadMessage(this.roomId).subscribe((msgs: IChat) => {
      this.messages=msgs
      console.log(msgs);
    })

    this._chatService.recieveMessages().subscribe((msg: unknown) => {
      this.messages.messages.push(msg as { time: Date; sender: string; content: string; })
    })
  }


  sendMessage() {
    
    if (this.messageContent.trim()) {
      this._chatService.sendMessage(this.roomId, this.user?._id!, this.messageContent,this.user?._id!,this.vendorId)
    this.messageContent=''
    }
  }


}
