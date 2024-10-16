import { Component, OnInit } from '@angular/core';
import { HeaderNameComponent } from "../../../components/header-name/header-name.component";
import { CommonModule } from '@angular/common';
import { UserDoc } from '../../../models/IUsers';

import { catchError, of, timeout } from 'rxjs';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { ApiRes } from '../../../models/IApiRes';
import { VendorService } from '../../../services/vendor.service';

@Component({
  selector: 'app-vendor-home',
  standalone: true,
  imports: [
    HeaderNameComponent,
    CommonModule,
    RouterModule
  ],
  templateUrl: './vendor-home.component.html',
  styleUrl: './vendor-home.component.css'
})
export class VendorHomeComponent implements OnInit {
  toggleShow: boolean = false
  user: UserDoc | null = null
  kycVerified: boolean = true

  constructor(private _vendorService: VendorService) {
  }

  toggleCollapse() {
    this.toggleShow = !this.toggleShow
  }

  ngOnInit(): void {
    this._vendorService.vendorDetails().pipe(
      timeout(3000),
      catchError((error) => {
        console.error('Error or timeout in vendorDetails:', error);
        return of(null);
      })
    ).subscribe({
      next: (data) => {
        if(data?.success) {
          this.user = data?.data;
          this.kycVerified = this.user?.isKYCVerified! ;
        }
      },
      complete: () => {
        console.log('vendorDetails completed');
      },
      error: (error) => {
        console.error('Error fetching vendor details:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch vendor details',
        })
      }
    });
  }

  logout() {
    localStorage.removeItem('vendor')
    window.location.reload();
  }
}

