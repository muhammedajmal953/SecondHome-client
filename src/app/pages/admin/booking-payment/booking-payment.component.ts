import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-booking-payment',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './booking-payment.component.html',
  styleUrl: './booking-payment.component.css'
})
export class BookingPaymentComponent implements OnInit{
  searchText!: string;

  constructor(private _adminService:AdminService,private _router:Router){}

  ngOnInit(): void {
    this._adminService.getAllBookings(1).subscribe({
      next: (res) => {
        if (res.success) {
          console.log(res.data);

          this.bookings=res.data
        }
      }, error: (err)=>{
        if (err.error.message === 'Please login') {
          localStorage.removeItem('admin')
          this._router.navigate(['/admin'])
        }
      }
    })
  }
searchUser() {

}
bookings: any;

changePage(arg0: string) {

}
page: any;

}
