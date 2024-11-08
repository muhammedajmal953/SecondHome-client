import { Component, OnInit } from '@angular/core';
import { ChatComponent } from "../../../components/chat/chat.component";
import { ChatService } from '../../../services/chat.service';

@Component({
  selector: 'app-chat-box',
  standalone: true,
  imports: [],
  templateUrl: './chat-box.component.html',
  styleUrl: './chat-box.component.css'
})
export class ChatBoxComponent implements OnInit{
  constructor(private _chatService: ChatService) { }

  ngOnInit(): void {
      
  }
}
