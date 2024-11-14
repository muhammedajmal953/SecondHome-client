import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UserService } from '../../../services/user.service';


@Component({
  selector: 'app-booking-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './booking-details.component.html',
  styleUrl: './booking-details.component.css',
})
export class BookingDetailsComponent implements OnInit {
  constructor(private _activatedRoute: ActivatedRoute,private _userService:UserService){}
  id!: string
  booking!:any
  ngOnInit(): void {
    this._activatedRoute.params.subscribe((params) => {
      this.id = params['id']
      this.fetchBooking(this.id)
    })

  }

  fetchBooking(id:string) {
    this._userService.getBookingDetails(id).subscribe({
      next: (res) => {
        if (res.success) {
          console.log('details',res.data);

          this.booking=res.data
        }
      },
      error:(err)=> {
        console.log(err);
      },
      complete:()=> {},
    })
  }

  getTotalAmount() {
    throw new Error('Method not implemented.');
  }
  contactHost() {
    throw new Error('Method not implemented.');
  }
  rateStay() {
    throw new Error('Method not implemented.');
  }
}
