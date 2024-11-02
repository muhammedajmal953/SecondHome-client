import { Component, OnDestroy, OnInit } from '@angular/core';
import { HeaderNameComponent } from "../../../components/header-name/header-name.component";
import { CommonModule } from '@angular/common';
import { UserDoc } from '../../../models/IUsers';

import {  Observable, Subscription, } from 'rxjs';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { VendorService } from '../../../services/vendor.service';
import { Store } from '@ngrx/store';
import * as VendorSelector from '../../../state/vendor/vendor.selecters';
import * as VendorActions from '../../../state/vendor/vendor.actions';

@Component({
  selector: 'app-vendor-home',
  standalone: true,
  imports: [
    HeaderNameComponent,
    CommonModule,
    RouterModule
  ],
  templateUrl: './vendor-home.component.html',
  styleUrl: './vendor-home.component.css'
})
export class VendorHomeComponent implements OnInit,OnDestroy {
  toggleShow: boolean = false
  user: UserDoc | null = null
  kycVerified: boolean = true
  vendor$!: Observable<UserDoc | null>
  subscription:Subscription=new Subscription()

  constructor(private _vendorService: VendorService, private _store: Store) {
    this.vendor$=this._store.select(VendorSelector.selectVendor)
  }

  toggleCollapse() {
    this.toggleShow = !this.toggleShow
  }

  ngOnInit(): void {
    this._store.dispatch(VendorActions.loadVendor())

    this.subscription=this.vendor$.subscribe((res) => {
      if (res) {
        this.user = res
        this.kycVerified===this.user.isKYCVerified
      }
      if (this.user?.IsActive === false) {
        Swal.fire({
          icon: 'error',
          toast: true,
          text:'You are Blocked By Admin'
        })
        this._store.dispatch(VendorActions.logout())
      }
    }, error => {
      Swal.fire({
        icon: 'error',
        toast: true,

        text:error.error.message
      })
    })
  }

  logout() {
    this._store.dispatch(VendorActions.logout())
  }
  ngOnDestroy(): void {
    if (this.subscription) {
        this.subscription.unsubscribe()
      }
  }
}

