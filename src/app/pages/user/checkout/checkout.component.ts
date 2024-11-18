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
import { environments } from '../../../../environment/environment';

declare var Razorpay: any;

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent implements OnInit {
  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _userService: UserService,
    private _store: Store,
    private _orderService: OrderService
  ) {}
  foodPrice: number = 0;
  totalPrice: number = 0;
  totalAmount!: number;
  hostel$: any;
  checkInDate!: Date | null;
  numberOfGuests: number = 1;
  user$!: Observable<UserDoc | null>;
  user!: UserDoc;
  rate: number = 0;
  bedType!: string;
  calcualatedValue: number = this.rate;
  Qty!: number;
  payment: string = 'fullmonth';
  advance!: number;
  id!: string;

  ngOnInit(): void {
    this._activatedRoute.params.subscribe((params) => {
      this.fetchHostel(params['id']);
    });

    this._store.dispatch(UserActions.loadUserActions());

    this.user$ = this._store.select(UserSelectors.selectUser);

    this.user$.subscribe({
      next: (res) => {
        if (res) {
          this.user = res;
        }
      },
    });
    this.calculateTotalPrice();
  }

  fetchHostel(id: string) {
    this._userService.getHostel(id).subscribe({
      next: (res) => {
        if (res.success) {
          this.hostel$ = res.data;
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
      },
    });
  }

  //calculate Total Price
  calculateTotalPrice() {
    this.totalPrice = this.calcualatedValue * this.numberOfGuests;

    this.totalAmount = this.totalPrice + this.foodPrice * this.numberOfGuests;
  }

  //selectingfood types
  selectFood(event: Event) {
    const target = event.target as HTMLSelectElement;

    this.foodPrice = Number(target.value);
    this.calculateTotalPrice();
  }

  //selecting payment type
  paymentType(event: Event) {
    const target = event.target as HTMLSelectElement;
    const value = target.value;

    console.log(value);

    if (value === 'fullMonth') {
      this.calcualatedValue = this.rate;
      this.advance = 0;
    } else {
      if (this.hostel$.advance) {
        this.advance = this.hostel$.advance;
        this.calcualatedValue = this.hostel$.advance;
      } else {
        this.calcualatedValue = this.rate;
      }
    }
    this.calculateTotalPrice();
  }

  changeType(event: Event) {
    if (event.target) {
      const target = event.target as HTMLSelectElement;
      console.log(target.value);

      this.hostel$.rates.forEach(
        (rate: { type: string; price: number; quantity: number }) => {
          if (rate.type === target.value) {
            this.rate = rate.price;

            this.calcualatedValue = this.rate;

            this.bedType = rate.type;
            this.Qty = rate.quantity;
          }
        }
      );
    }
    this.calculateTotalPrice();
  }

  incrementGuest() {
    this.numberOfGuests++;
    this.calculateTotalPrice();
  }

  decrementGuest() {
    this.numberOfGuests--;
    this.calculateTotalPrice();
  }

  dateValidate() {
    if (this.checkInDate && new Date(this.checkInDate) <= new Date()) {
      Swal.fire({
        icon: 'error',
        toast: true,
        text: 'select a valid date',
        showConfirmButton: false,
        timer: 2000,
      });
      this.checkInDate = null;
    }
  }

  confirmBooking() {
    if (this.validateBooking()) {
      this.initiatePayment();
    }
  }

  private initiatePayment() {
    this._orderService
      .createOrder({
        amount: this.totalAmount * 100,
        currency: 'INR',
        reciept: `reciept_${new Date().getTime()}`,
        hostId: this.hostel$._id,
        bedCount: this.numberOfGuests,
        bedType: this.bedType,
      })
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.openRazorPayModal(res.data);
          }
        },
        error: (err) => {
          console.log(err);
          Swal.fire({
            icon: 'error',
            toast: true,
            text: err.error.message,
            showConfirmButton: false,
            timer: 2000,
          });
        },
      });
  }

  openRazorPayModal(data: Record<string, unknown>) {
    if (this.totalAmount > 20000) {
      Swal.fire({
        icon: 'warning',
        toast: true,
        text: 'For testing, please keep amount below ₹20,000',
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    }

    const options = {
      key: environments.RazorPay_id,
      amount: this.totalAmount * 100,
      currency: 'INR',
      name: this.hostel$.name,
      description: this.bedType,
      order_id: data['id'],
      prefill: {
        name: this.user.First_name,
        email: this.user.Email,
        contact: this.user.Phone,
      },
      handler: (response: RazorpayResponse) => {
        this.handlePaymentSuccess(response);
      },
      modal: {
        ondismiss: () => {
          Swal.fire({
            icon: 'error',
            toast: true,
            text: 'Failed to Payment please book again',
            showConfirmButton: false,
            timer: 2000,
          });
        },
      },
      confirm_close: true,
      escape: true,
      animation: true,
    };
    const razorpayInstance = new Razorpay(options);
    razorpayInstance.open();
  }

  handlePaymentSuccess(response: RazorpayResponse) {
    Swal.fire({
      icon: 'success',
      toast: true,
      text: 'Booking confirmed successfully!',
      showConfirmButton: false,
      timer: 2000,
      position: 'top-end',
    });
    const bookingData = {
      hostelId: this.hostel$._id,
      userId: this.user._id,
      checkInDate: this.checkInDate,
      vendorId: this.hostel$.owner,
      bedType: this.bedType,
      foodRatePerGuest: this.foodPrice,
      numberOfGuests: this.numberOfGuests,
      totalAmount: this.totalAmount,
      advancePerGuest: this.advance || 0,
      paymentDetails: {
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_signature: response.razorpay_signature,
      },
    };

    this._orderService.saveBooking(bookingData).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          toast: true,
          text: 'Booking confirmed successfully!',
          showConfirmButton: false,
          timer: 2000,
        });
        this._router.navigate([
          `/user/home/hostels/booking-success/${res.data._id}`,
        ]);
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          toast: true,
          text: err.error.message,
          showConfirmButton: false,
          timer: 2000,
        });
      },
    });
  }

  validateBooking(): boolean {
    if (!this.checkInDate) {
      Swal.fire({
        icon: 'error',
        toast: true,
        text: 'select a valid date',
        showConfirmButton: false,
        timer: 2000,
      });
      return false;
    }
    if (!this.rate) {
      Swal.fire({
        icon: 'error',
        toast: true,
        text: 'select a bed type',
        showConfirmButton: false,
        timer: 2000,
      });
      return false;
    }
    return true;
  }
}
