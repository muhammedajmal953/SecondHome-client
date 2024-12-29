import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { ToFirstCapitalPipe } from '../../../pipe/to-first-capital.pipe';
import Swal from 'sweetalert2';
import { environments } from '../../../../environment/environment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { GoogleMapsModule } from '@angular/google-maps';
import { HostelService } from '../../../services/hostel.service';
import { Hostels } from '../../../models/IHostel';

@Component({
  selector: 'app-view-hostel',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ToFirstCapitalPipe,
    RouterModule,
    GoogleMapsModule,
  ],
  templateUrl: './view-hostel.component.html',
  styleUrl: './view-hostel.component.css',
})
export class ViewHostelComponent implements OnInit {
  hostel$!: any;
  googleUrl!: string;
  protectedUrl!: SafeResourceUrl;
  apiKey: string = environments.googleApiKey;
  rate!: number;
  Qty!: number;
  bedType!: string;
  similarHostel: Hostels[] = [];

  rateDetails!: {
    price: number;
    type: string;
    quantity: number;
  };
  numberOfStars: number = 0
  numberOfReviews:number=0

  lat: number = 11.2602402;
  lng: number = 76.034563;
  directionsUrl!: string;

  constructor(
    private _router: Router,
    private _userService: UserService,
    private _activeRoute: ActivatedRoute,
    private _sanitizer: DomSanitizer,
    private _hostelService: HostelService
  ) {}

  ngOnInit(): void {
    this._activeRoute.params.subscribe((params) => {
      this.fetchHostel(params['id']);
    });
  }

  fetchHostel(id: string) {
    this._userService.getHostel(id).subscribe({
      next: (res) => {
        if (res.success) {
          this.hostel$ = res.data;
          this.rateDetails = this.hostel$.rates[0];
          this.rate = this.rateDetails.price;
          this.Qty = this.rateDetails.quantity;
          this.bedType = this.rateDetails.type;

          this.googleUrl = `https://www.google.com/maps/embed/v1/place?key=${
            this.apiKey
          }&q=${Number(this.hostel$.address.latitude)},${Number(
            this.hostel$.address.longtitude
          )}&zoom=18&maptype=roadmap`;
          this.protectedUrl = this._sanitizer.bypassSecurityTrustResourceUrl(
            this.googleUrl
          );
          console.log('latitude', this.hostel$.address.latitude);

          this.directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=Current+Location&destination=${this.hostel$.address.latitude},${this.hostel$.address.longtitude}`;

          this.lat = Number(this.hostel$.address.latitude);
          this.lng = Number(this.hostel$.address.longitude);
          const count=this.hostel$.reviews.reviews.length

          this.numberOfReviews = count
          this.numberOfStars=this.hostel$.reviews.reviews.reduce((acc:number,cur:any)=>acc+=cur.rating,0)
        }
        this.sameCategoryHostels();
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
  openDirection() {
    console.log('open direction clicked');
    window.open(this.directionsUrl, '_blank');
  }

  changeType(event: Event) {
    if (event.target) {
      const target = event.target as HTMLSelectElement;
      this.hostel$.rates.forEach((element: any) => {
        if (element._id === target.value) {
          this.rateDetails = element;
          this.rate = this.rateDetails.price;
          this.Qty = this.rateDetails.quantity;
          this.bedType = this.rateDetails.type;
        }
      });
    }
  }

  bookNow(id: string) {
    if (id) {
      this._router.navigate([`/user/home/hostels/checkout/${id}`]);
    }
  }

  changeRateDetails(id: string) {
    this.hostel$.rates.forEach((element: any) => {
      if (element._id === id) {
        this.rateDetails = element;
        this.rate = this.rateDetails.price;
        this.Qty = this.rateDetails.quantity;
        this.bedType = this.rateDetails.type;
      }
    });
  }

  openChat(vendorId: string) {
    this._router.navigate([`/user/home/chat/${vendorId}`]);
  }

  sameCategoryHostels() {
    this._hostelService.getAllHostel(1, '', {}, '').subscribe({
      next: (res) => {
        if (res.success) {
          if (res.data) {
            res.data.forEach((hostel: Hostels) => {
              if (hostel.category === this.hostel$.category) {
                this.similarHostel.push(hostel);
              }
            });
          }
        }
      },
    });
  }

  viewReviews(id:string) {
    this._router.navigate([`/user/home/hostelDetails/reviews/${id}`])
  }
}
