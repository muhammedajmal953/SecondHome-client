import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HostelCardComponent } from "../../../components/hostel-card/hostel-card.component";
import { Hostels } from '../../../models/IHostel';
import { WishlistService } from '../../../services/wishlist.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [
    CommonModule,
    HostelCardComponent
],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent implements OnInit{
  hostels$!: Hostels[]


  constructor(private _wishlistService: WishlistService,private _router:Router) { }

  ngOnInit(): void {
    this._wishlistService.getAllWishList(1).subscribe({
      next:(res)=> {
        if (res) {
          if (res.success) {
            this.hostels$=res.data
          }
        }
      },
      error: (err) => {
        console.log(err);

        Swal.fire({
          toast: true,
          icon: 'warning',
          text: err.error.message,
        })
        if (err.error.message === 'Please login') {
          localStorage.removeItem('user')
          this._router.navigate(['/user'])
        }

      },
      complete: () => {
        console.log('wishlist completed');
      }
    })
  }

  unSave(id: string) {
    Swal.fire({
      icon: 'warning',
      toast:true,
      title: 'Are You Sure',
      text: 'to remove from the Wishlist?',
      showCancelButton:true
    }).then((res) => {
      if (res.isConfirmed) {
        this._wishlistService.removeFromWishlist(id).subscribe({
          next: (res) => {
            if (res.success) {
              Swal.fire({
                icon: 'success',
                title: 'Removed The Hostel',
                showConfirmButton: false,
                position: 'top',
                width: 'screen',
                timer:1500,
                toast: true
              })
              this.hostels$ = this.hostels$.filter((hostel) => hostel._id != id)
            }
          }, error: (err) => {
            Swal.fire({
              icon: 'error',
              title: err.error.message,
              toast: true,
              timer:2000
            })
          }
        })
      }
    })

  }
}
