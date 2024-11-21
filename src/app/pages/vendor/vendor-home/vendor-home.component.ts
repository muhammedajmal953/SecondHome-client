import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDoc } from '../../../models/IUsers';

import { Observable, Subscription } from 'rxjs';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { VendorService } from '../../../services/vendor.service';
import { Store } from '@ngrx/store';
import * as VendorSelector from '../../../state/vendor/vendor.selecters';
import * as VendorActions from '../../../state/vendor/vendor.actions';
import { FcmService } from '../../../services/fcm.service';
import { BookingNotificationComponent } from "../../../components/booking-notification/booking-notification.component";

@Component({
  selector: 'app-vendor-home',
  standalone: true,
  imports: [CommonModule, RouterModule, BookingNotificationComponent],
  templateUrl: './vendor-home.component.html',
  styleUrl: './vendor-home.component.css',
})
export class VendorHomeComponent implements OnInit, OnDestroy {
  toggleShow: boolean = false;
  user: UserDoc | null = null;
  kycVerified: boolean = true;
  vendor$!: Observable<UserDoc | null>;
  subscription: Subscription = new Subscription();
  title!: string
  body!: string
  pic!: string
  showNotification!:boolean

  constructor(private _vendorService: VendorService, private _store: Store,private _fcmService:FcmService) {
    this.vendor$ = this._store.select(VendorSelector.selectVendor);
  }

  toggleCollapse() {
    this.toggleShow = !this.toggleShow;
  }

  ngOnInit(): void {
    this._store.dispatch(VendorActions.loadVendor());
    this.subscription = this.vendor$.subscribe(
      (res) => {
        if (res) {
          this.user = res;
          this.kycVerified === this.user.isKYCVerified;
        }
        if (this.user?.IsActive === false) {
          Swal.fire({
            icon: 'error',
            toast: true,
            text: 'You are Blocked By Admin',
          });
          this._store.dispatch(VendorActions.logout());
        }
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          toast: true,
          text: error.error.message,
        });
      }
    );

    this._fcmService.receiveMessage().subscribe(
      (message) => {
        console.log('Vendor notification', message.notification);
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
    this._store.dispatch(VendorActions.logout());
  }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  closeNotification() {
    this.showNotification=false
  }


}
