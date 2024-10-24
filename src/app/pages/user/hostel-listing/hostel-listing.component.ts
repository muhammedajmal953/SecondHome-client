import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { HostelService } from '../../../services/hostel.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hostel-listing',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './hostel-listing.component.html',
  styleUrl: './hostel-listing.component.css'
})
export class HostelListingComponent implements OnInit{
  constructor(private _userService: UserService,private _hostelService:HostelService,private _router:Router, @Inject(PLATFORM_ID) private platform_id:string) { }

  hostels: any[] = []
  searchQuery: string = ''
  page: number = 1
  count!:number

  ngOnInit(): void {
    let storedPage: string

    if (isPlatformBrowser(this.platform_id)) {
      storedPage= localStorage.getItem('uhp')!;
    }
    if (storedPage!) {
      this.page = +storedPage;
    }
    this.fetchHostels()
  }

  changePage(direction: 'increment' | 'decrement') {
    if (direction === 'increment'&&this.count>0) {
      this.page++;
    } else if (direction === 'decrement' && this.page > 1) {
      this.page--;
    }

    this.fetchHostels()
  }

  fetchHostels() {
    localStorage.setItem('uhp', this.page.toString());
    this._hostelService.getAllHostel(this.page, this.searchQuery).subscribe({
      next: (res) => {
        if (res.success) {
          this.hostels = res.data
          this.count=this.hostels.length
        } else {
          Swal.fire({
            icon: 'error',
            text: 'Internal server error'
          })
        }
      }
    })
  }

  searchButton() {
    this.fetchHostels()
  }

  showHostel(id:string) {
    this._router.navigate([`/user/home/hostelDetails/${id}`])
  }
}
