import { Component, OnInit } from '@angular/core';
import { HeaderNameComponent } from "../../../components/header-name/header-name.component";
import { CommonModule } from '@angular/common';
import { UserDoc } from '../../../models/IUsers';
import { VendorService } from '../../../services/vendor.service';
import { catchError, of, timeout } from 'rxjs';
import { RouterModule } from '@angular/router';

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

  constructor(private vendorService: VendorService) {


  }

  toggleCollapse() {
    this.toggleShow = !this.toggleShow
  }

  ngOnInit(): void {
    this.vendorService.vendorDetails().pipe(
      timeout(3000), // 10 seconds timeout
      catchError((error) => {
        console.error('Error or timeout in vendorDetails:', error);
        return of(null); // or handle the error as appropriate
      })
    ).subscribe({
      next: (data) => {
        this.user = data?.data;
      },
      complete: () => {
        console.log('vendorDetails completed');
      }
    });
  }
}

