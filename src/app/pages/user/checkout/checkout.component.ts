import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UserDoc } from '../../../models/IUsers';
import * as UserActions from '../../../state/user/user.actions';
import * as UserSelectors from '../../../state/user/user.selector';
import { CommonModule } from '@angular/common';
import { error } from 'console';
import { OrderService } from '../../../services/order.service';


@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent implements OnInit {

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _userService: UserService,
    private _store: Store,
    private _orderService:OrderService
  ) {}
  foodPrice: number=0;
  totalPrice: number=0;
  totalAmount!: number;
  hostel$: any;
  checkInDate!: Date|null;
  numberOfGuests: number=1;
  user$!: Observable<UserDoc | null>
  user!: UserDoc
  rate: number = 0;
  bedType!:string
  calcualatedValue:number=this.rate
  Qty!: number;
  payment: string = 'fullmonth'
  id!:string

  ngOnInit(): void {
    this._activatedRoute.params.subscribe((params) => {
      this.fetchHostel(params['id'])
    })

    this._store.dispatch(UserActions.loadUserActions())

    this.user$ = this._store.select(UserSelectors.selectUser)

    this.user$.subscribe({
      next: res => {
        if (res) {
          this.user=res
        }
      }
    })
    this.calculateTotalPrice()
  }

  fetchHostel(id:string) {
    this._userService.getHostel(id).subscribe({
      next: (res) => {
        if (res.success) {
          this.hostel$ = res.data
        }
      },
      error: (err) => {
        console.log(err);
        Swal.fire({
          position: 'top',
          icon: 'error',
          text: err.error.message,
          showConfirmButton: false,
          timer: 1500,
          toast: true,
        });
      },
      complete: () => {
        console.log('request completed');

      }
    })
  }

  //calculate Total Price
  calculateTotalPrice() {
    this.totalPrice = (this.calcualatedValue * this.numberOfGuests)

    this.totalAmount=this.totalPrice+ (this.foodPrice * this.numberOfGuests)
  }


 //selectingfood types
  selectFood(event:Event) {
    const target = event.target as HTMLSelectElement

    this.foodPrice = Number(target.value)
    this.calculateTotalPrice()
  }


  //selecting payment type
  paymentType(event:Event) {
    const target = event.target as HTMLSelectElement
    const value = target.value

    console.log(value);


    if (value === 'fullMonth') {
      this.calcualatedValue=this.rate
    } else {
      if (this.hostel$.advance) {
        this.calcualatedValue=this.hostel$.advance
      } else {
        this.calcualatedValue=this.rate
      }
    }
    this.calculateTotalPrice()
  }



  changeType(event:Event) {
    if (event.target) {
      const target = event.target as HTMLSelectElement
      this.hostel$.rates.forEach((rate:{type:string,price:number,quantity:number}) => {
        if (rate.type === target.value) {
          this.rate = rate.price
          if (!this.calcualatedValue) {
            this.calcualatedValue=this.rate
          }
          this.bedType=rate.type
          this.Qty=rate.quantity
        }
      })
    }
    this.calculateTotalPrice()
  }

  incrementGuest() {
    this.numberOfGuests++
    this.calculateTotalPrice()
  }

  decrementGuest() {
    this.numberOfGuests--
    this.calculateTotalPrice()
  }

  dateValidate() {
    if (this.checkInDate&&new Date(this.checkInDate) <= new Date()) {
      Swal.fire({
        icon: 'error',
        toast: true,
        text:'select a valid date',
        showConfirmButton: false,
        timer:2000
      })
      this.checkInDate=null
    }
  }


  confirmBooking() {
    if (this.validateBooking()) {
       this.initiatePayment()
    }
  }

  private initiatePayment() {
    this._orderService.createOrder({
      amount: this.totalAmount * 100,
      currency: 'INR',
      reciept: `reciept_${new Date().getTime()}`,
      hostId: this.hostel$._id,
      bedCount: this.numberOfGuests,
      bedType:this.bedType
    }).subscribe({
      next: (res) => {
        if (res.success) {
          console.log(res.data);

          this.openRazorPayModal(res.data)
        }
      }, error: err => {
        console.log(err);

      }
    })
  }


  openRazorPayModal(data: Record<string,unknown>) {
    console.log('opening razor pay ui....',data);
    alert('opening razor pay ui....')

 }

  validateBooking():boolean {
    if (!this.checkInDate) {
      Swal.fire({
        icon: 'error',
        toast: true,
        text:'select a valid date',
        showConfirmButton: false,
        timer:2000
      })
     return false
    }
    if (!this.rate) {
      Swal.fire({
        icon: 'error',
        toast: true,
        text:'select a bed type',
        showConfirmButton: false,
        timer:2000
      })
      return false
    }
    return true
  }
}