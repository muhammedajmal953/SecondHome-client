import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserDoc } from '../../../models/IUsers';
import { VendorService } from '../../../services/vendor.service';
import { ApiRes } from '../../../models/IApiRes';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as VendorSelector from '../../../state/vendor/vendor.selecters';
import * as VendorActions from '../../../state/vendor/vendor.actions';

@Component({
  selector: 'app-vendor-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vendor-profile.component.html',
  styleUrl: './vendor-profile.component.css',
})
export class VendorProfileComponent implements OnInit {
  user$!: Observable<UserDoc | null>;

  constructor(
    private _vendorService: VendorService,
    private _router: Router,
    private store: Store
  ) {
    this.user$ = this.store.select(VendorSelector.selectVendor);
  }
  ngOnInit(): void {
    this.store.dispatch(VendorActions.loadVendor());

    this.user$.subscribe((data: any) => {
      if (data) {
        this.profileImage = data.Avatar
          ? data.Avatar
          : 'https://www.dgvaishnavcollege.edu.in/dgvaishnav-c/uploads/2021/01/dummy-profile-pic.jpg';
        this.user = data;
      }
    });
  }

  user!: UserDoc;

  profileImage: string =
    'https://www.dgvaishnavcollege.edu.in/dgvaishnav-c/uploads/2021/01/dummy-profile-pic.jpg';
  editProfile() {
    this._router.navigate(['/vendor/home/edit-profile']);
  }
  saveProfile() {
    throw new Error('Method not implemented.');
  }
  changePassword() {
    this._router.navigate(['/vendor/home/change-password']);
  }
  walletBalance: any;
  addMoney() {
    throw new Error('Method not implemented.');
  }
  debit() {
    throw new Error('Method not implemented.');
  }
  bookings: any;
  editBooking(_t23: any) {
    throw new Error('Method not implemented.');
  }
  cancelBooking(_t23: any) {
    throw new Error('Method not implemented.');
  }
}
