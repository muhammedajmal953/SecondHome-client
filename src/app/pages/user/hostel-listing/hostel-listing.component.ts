import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { HostelService } from '../../../services/hostel.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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
  constructor(private _userService: UserService,private _hostelService:HostelService,private _router:Router) { }

  hostels: any[] = []
  searchQuery: string = ''
  page:number=1

  ngOnInit(): void {
    this.fetchHostels()
  }

  fetchHostels() {
    this._hostelService.getAllHostel(this.page, this.searchQuery).subscribe({
      next: (res) => {
        if (res.success) {
          this.hostels=res.data
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
