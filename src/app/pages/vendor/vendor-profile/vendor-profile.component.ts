import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserDoc } from '../../../models/IUsers';
import { VendorService } from '../../../services/vendor.service';
import { ApiRes } from '../../../models/IApiRes';
import { Router } from '@angular/router';



@Component({
  selector: 'app-vendor-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './vendor-profile.component.html',
  styleUrl: './vendor-profile.component.css'
})
export class VendorProfileComponent implements OnInit{

  constructor(private _vendorService: VendorService,private _router:Router){}
ngOnInit(): void {
  this._vendorService.vendorDetails().subscribe({
    next: (res:ApiRes) => {
      if(res.success) {
        this.user = res.data;
        res.data.Avatar?this.profileImage=res.data.Avatar:'https://www.dgvaishnavcollege.edu.in/dgvaishnav-c/uploads/2021/01/dummy-profile-pic.jpg'

      }
    }
  })
}

  user!: UserDoc


  profileImage:string='https://www.dgvaishnavcollege.edu.in/dgvaishnav-c/uploads/2021/01/dummy-profile-pic.jpg'
  editProfile() {
  this._router.navigate(['/vendor/home/edit-profile'])
}
saveProfile() {
throw new Error('Method not implemented.');
}
changePassword() {
 this._router.navigate(['/vendor/home/change-password'])
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
