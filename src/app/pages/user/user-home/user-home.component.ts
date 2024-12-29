import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserDoc } from '../../../models/IUsers';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as UserActions from '../../../state/user/user.actions';
import * as UserSelectors from '../../../state/user/user.selector';
import Swal from 'sweetalert2';
import { FcmService } from '../../../services/fcm.service';




@Component({
  selector: 'app-user-home',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
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

  constructor(private store: Store,private _fcmService:FcmService,private _router:Router) {
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
      if (error.error.message === 'Please login') {
        localStorage.removeItem('user')
        this._router.navigate(['/user'])
      }
    })

    this._fcmService.receiveMessage().subscribe(
      (message) => {

        console.log('user notification',message);
        this.body = message.notification.body
        this.title = message.notification.title
        this.pic = message.notification.image
        this.showNotification = true

        Swal.fire({
          toast: true,
          title: this.title,
          text: this.body,
          imageUrl: this.pic,
          position:'top-right'
        })
    })
  }

  logout() {
   this.store.dispatch(UserActions.logout())
  }

 ngOnDestroy(): void {
     this.subscription.unsubscribe()
 }
}
