import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { ApiRes } from '../../../models/IApiRes';
import { UserDoc } from '../../../models/IUsers';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import * as UserActions from '../../../state/user/user.actions';
import * as UserSelectors from '../../../state/user/user.selector';
import { OrderService } from '../../../services/order.service';

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
export class ProfileComponent implements OnInit,OnDestroy{
  user!: UserDoc
  user$!: Observable<UserDoc | null>
  destroy$=new Subscription()

  constructor(private _userService: UserService,private _router:Router,private _store:Store,private _orderService:OrderService){}
  ngOnInit(): void {
    this._store.dispatch(UserActions.loadUserActions())
    this.user$=this._store.select(UserSelectors.selectUser)
    this.destroy$=this.user$.subscribe((data:any) => {
      if (data) {
        this.profileImage=data.Avatar?data.Avatar:'https://www.dgvaishnavcollege.edu.in/dgvaishnav-c/uploads/2021/01/dummy-profile-pic.jpg'
        this.user=data
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
    if (this.user?.IsActive === false) {
      Swal.fire({
        icon: 'error',
        toast: true,
        text: 'You are Blocked By Admin'
      })
      this._store.dispatch(UserActions.logout())
    }

    this.fetchBookings()
  }


  fetchBookings() {
    this._orderService.getBookings(1).subscribe({
      next: (res) => {
        if (res.success) {
          this.bookings = res.data

          console.log(this.bookings);

        }
      }, error: err => {
        console.log(err.error);

      }, complete: () => {

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
  bookings:any;
  editBooking(_t23: any) {
  throw new Error('Method not implemented.');
  }
  cancelBooking(id: string, i: number) {
    console.log('clicked');

    const textArea = document.getElementById(`reason${i}`) as HTMLTextAreaElement
    const reason=textArea.value
    if (reason.trim()) {
      this._orderService.cancelBooking(reason.trim(), id).subscribe({
        next: (res) =>{
          if (res.success) {
            console.log(res.message);
            this.closeModal(i)
            this.bookings.forEach((booking:any) => {
              if (booking._id === id) {
                booking.isCancelled=true
              }
            })
          }
        }
      })
    }

  }

  ngOnDestroy(): void {
    this.destroy$.unsubscribe()
  }

  openModal(i:any) {
    const modal:any = document.getElementById(`my_modal_5${i}`)
    modal.showModal()
  }

  closeModal(i: any) {
    const modal:any = document.getElementById(`my_modal_5${i}`)
    modal?.close()
  }
}
