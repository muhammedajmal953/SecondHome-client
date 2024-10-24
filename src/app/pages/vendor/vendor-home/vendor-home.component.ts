import { Component, OnInit } from '@angular/core';
import { HeaderNameComponent } from "../../../components/header-name/header-name.component";
import { CommonModule } from '@angular/common';
import { UserDoc } from '../../../models/IUsers';

import { catchError, Observable, of, timeout } from 'rxjs';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { ApiRes } from '../../../models/IApiRes';
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
export class VendorHomeComponent implements OnInit {
  toggleShow: boolean = false
  user: UserDoc | null = null
  kycVerified: boolean = true
  vendor$!:Observable<UserDoc|null>

  constructor(private _vendorService: VendorService, private _store: Store) {
    this.vendor$=this._store.select(VendorSelector.selectVendor)
  }

  toggleCollapse() {
    this.toggleShow = !this.toggleShow
  }

  ngOnInit(): void {
    this._store.dispatch(VendorActions.loadVendor())
  }

  logout() {
    this._store.dispatch(VendorActions.logout())

  }
}

