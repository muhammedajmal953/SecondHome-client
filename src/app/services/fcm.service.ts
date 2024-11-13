import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class FcmService {

  constructor(private _afMessaging: AngularFireMessaging) { }


  requestPermission():Observable<string | null> {
    return this._afMessaging.requestToken;
  }

  receiveMessage(): Observable<any> {
    return this._afMessaging.messages;
  }
}
