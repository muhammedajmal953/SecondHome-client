import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private _socket:Socket) {
  }
  joinRoom(roomId: string){
    this._socket.emit('joinRoom',{roomId})
  }

  sendMessage(roomId: string, sender: string, content: string) {
    this._socket.emit('message')
  }

  loadMessage(): Observable<any>{
    return this._socket.fromEvent('loadMessages');
  }

  recieveMessages(): Observable<any>{
    return this._socket.fromEvent('message')
  }
}
