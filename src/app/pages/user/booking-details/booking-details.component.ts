import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../../services/user.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';



@Component({
  selector: 'app-booking-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './booking-details.component.html',
  styleUrl: './booking-details.component.css',
})
export class BookingDetailsComponent implements OnInit {
  constructor(private _activatedRoute: ActivatedRoute,private _userService:UserService,private router:Router){}
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
        if (err.error.message === 'Please login') {
          localStorage.removeItem('user')
          this.router.navigate(['/user'])
        }
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

  downloadInovoice(booking=this.booking) {
    const doc = new jsPDF()

    doc.setFontSize(16);
    doc.text('Booking Invoice',10,10)

    const headers = [['Sl.No', 'User Id', 'OrderId', 'Hostel Name', 'No of Guests', 'Food Amount', 'Total Amount']]
    const data = [
      [1,booking[0].userId,booking[0]._id,booking[0].hostelDetails.name,booking[0].numberOfGuests,(booking[0].numberOfGuests*booking[0].foodRatePerGuest),booking[0].totalAmount]
    ]
    autoTable(doc, {
      head: headers,
			body: data,
			startY: 30,
    })

    doc.save()
  }
}
