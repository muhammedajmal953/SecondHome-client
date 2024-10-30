import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booking-successfull',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './booking-successfull.component.html',
  styleUrl: './booking-successfull.component.css'
})
export class BookingSuccessfullComponent implements OnInit{

  constructor(private _router: Router, private _activatedRoute: ActivatedRoute, private _orderService: OrderService) { }

 bookingId!:string

  ngOnInit(): void {
    this._activatedRoute.params.subscribe((res) => {
      this.bookingId=res['id']
    })
  }

  viewHostels() {
    this._router.navigate(['/user/home/hostels'])
    }
    goToHome() {
     this._router.navigate(['/user'])
  }
}
