import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserDoc } from '../../../models/IUsers';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as UserActions from '../../../state/user/user.actions';
import * as UserSelectors from '../../../state/user/user.selector';
import Swal from 'sweetalert2';
import { FcmOptions } from '@angular/fire/messaging';
import { FcmService } from '../../../services/fcm.service';
import { BookingNotificationComponent } from "../../../components/booking-notification/booking-notification.component";


@Component({
  selector: 'app-user-home',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    BookingNotificationComponent
],
  templateUrl: './user-home.component.html',
  styleUrl: './user-home.component.css'
})
export class UserHomeComponent implements OnInit,OnDestroy {
  toggleShow: boolean = false
  user$: Observable<UserDoc | null>
  user: UserDoc | null = null
  private subscription = new Subscription()
  title!: string
  body!: string
  pic!: string
  showNotification!:boolean

  constructor(private store: Store,private _fcmService:FcmService) {
    this.user$=this.store.select(UserSelectors.selectUser)
  };
  toggleCollapse() {
    this.toggleShow = !this.toggleShow
  }

  ngOnInit(): void {
    this.store.dispatch(UserActions.loadUserActions())

    this.subscription=this.user$.subscribe((res) => {
      if (res) {
        this.user=res
      }
      if (this.user?.IsActive === false) {
        Swal.fire({
          icon: 'error',
          toast: true,
          text:'You are Blocked By Admin'
        })
        this.store.dispatch(UserActions.logout())
      }
    }, error => {
      Swal.fire({
        position: 'top',
        icon: 'error',
        text: error.error.message,
        showConfirmButton: false,
        timer: 1500,
        toast: true,
      });
    })

    this._fcmService.receiveMessage().subscribe(
      (message) => {
        console.log(message);
        this.body = message.notification.body
        this.title = message.notification.title
        this.pic = message.notification.image
        this.showNotification=true
    })
  }

  logout() {
   this.store.dispatch(UserActions.logout())
  }

 ngOnDestroy(): void {
     this.subscription.unsubscribe()
 }
}
