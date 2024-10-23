import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Hostels } from '../../../models/IHostel';
import { VendorService } from '../../../services/vendor.service';

@Component({
  selector: 'app-vendor-hostels',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './vendor-hostels.component.html',
  styleUrl: './vendor-hostels.component.css'
})
export class VendorHostelsComponent implements OnInit{
  hostels: Partial<Hostels>[] = []
  page: number = 1
  searchQuery:string=''
  constructor(private _router:Router,private _vendorService:VendorService) {

  }
  ngOnInit(): void {
    this._vendorService.getAllHostels(this.page, this.searchQuery).subscribe({
      next: (res) => {
        if (res.success) {
          this.hostels=res.data
        }
      }
    })
  }
  addHostel() {
    this._router.navigate(['/vendor/home/add-hostel']);
  }

  editHostel(id: string) {
    this._router.navigate([`/vendor/home/edit-hostel`],{queryParams:{id:id}})
  }
}
