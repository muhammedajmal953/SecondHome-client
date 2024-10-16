import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { ApiRes } from '../../../models/IApiRes';
import { UserDoc } from '../../../models/IUsers';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
  user!: UserDoc

  constructor(private _userService: UserService,private _router:Router){}
  ngOnInit(): void {
    this._userService.getUser().subscribe({
      next: (res:ApiRes) => {
        if(res.success) {
          this.user = res.data;
          res.data.Avatar?this.profileImage=res.data.Avatar:'https://www.dgvaishnavcollege.edu.in/dgvaishnav-c/uploads/2021/01/dummy-profile-pic.jpg'

        }
      }
    })
  }




    profileImage:string='https://www.dgvaishnavcollege.edu.in/dgvaishnav-c/uploads/2021/01/dummy-profile-pic.jpg'
    editProfile() {
    this._router.navigate(['/user/home/edit-profile'])
  }
  saveProfile() {
  throw new Error('Method not implemented.');
  }
  changePassword() {
  this._router.navigate(['/user/home/change-password'])
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
