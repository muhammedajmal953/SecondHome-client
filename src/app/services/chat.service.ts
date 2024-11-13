import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable, take } from 'rxjs';
import { IChat } from '../models/IChat';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private _socket:Socket) {
  }
  joinRoom(roomId: string){
   return this._socket.emit('joinRoom',{roomId})
  }

  sendMessage(roomId: string, sender: string, content: string,userId:string,vendorId:string) {
   return this._socket.emit('message',{roomId,sender,content,userId,vendorId})
  }
  recieveMessages(){
    return this._socket.fromEvent('message')
  }

  getAllrooms(id:string,role:string): Observable<any> {
    this._socket.emit('rooms', { id, role })
    return this._socket.fromEvent('rooms').pipe(take(1))
  }

  loadMessage(roomId: string): Observable<any> {
    this._socket.emit('loadMessages', roomId);
    return this._socket.fromEvent('loadMessages');
  }

  
}
