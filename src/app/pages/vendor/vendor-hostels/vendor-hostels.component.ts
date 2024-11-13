import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Hostels } from '../../../models/IHostel';
import { VendorService } from '../../../services/vendor.service';
import Swal from 'sweetalert2';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-vendor-hostels',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vendor-hostels.component.html',
  styleUrl: './vendor-hostels.component.css',
})
export class VendorHostelsComponent implements OnInit {
  bookings: any;
  deleteHostel(arg0: string | undefined) {
    throw new Error('Method not implemented.');
  }

  hostels: Partial<Hostels>[] = [];
  page: number = 1;
  totalAmount!:number
  searchQuery: string = '';
  activeTab: any='hostels';
  constructor(private _router: Router, private _vendorService: VendorService,private _orderService:OrderService) {}
  ngOnInit(): void {
    this._vendorService.getAllHostels(this.page, this.searchQuery).subscribe({
      next: (res) => {
        if (res.success) {
          this.hostels = res.data;
        }
      },
      error: (error) => {
        Swal.fire({
          position: 'top',
          icon: 'error',
          text: error.error.message || 'Something went wrong',
          showConfirmButton: false,
          timer: 1500,
          toast: true,
        });
      },
      complete: () => {},
    });

    this.fetchBookings()
  }
  addHostel() {
    this._router.navigate(['/vendor/home/add-hostel']);
  }

  editHostel(id: string) {
    this._router.navigate([`/vendor/home/edit-hostel`], {
      queryParams: { id: id },
    });
  }

  fetchBookings() {
    this._vendorService.vendorBookings(1).subscribe({
      next: (res) => {
        if (res.success) {
          this.bookings = res.data
          this.totalAmount=this.bookings.reduce((acc:number,cur:any)=>acc+=cur.totalAmount,0)
        }
      },
      error: err => {
        Swal.fire({
          position: 'top',
          icon: 'error',
          text: err.error.message || 'Something went wrong',
          showConfirmButton: false,
          timer: 1500,
          toast: true,
        })
      },
      complete:()=>{}
    });
  }

  approveCancelation(bookingId:string,i:number) {
    this._vendorService.cancelConform(bookingId).subscribe({
      next: (res) => {
        Swal.fire({
          position: 'top',
          icon: 'success',
          text: res.message,
          showConfirmButton: false,
          timer: 1500,
          toast: true,
        })

        this.bookings.forEach((element:any) => {
          if (element._id  === bookingId) {
              element.isActive=false
            }
        });
        this.closeModal(i)
      }, error: (error) => {
        Swal.fire({
          position: 'top',
          icon: 'error',
          text: error.error.message || 'Something went wrong',
          showConfirmButton: false,
          timer: 1500,
          toast: true,
        })
      }
    })
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
