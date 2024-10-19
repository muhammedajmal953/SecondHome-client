import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HostelService } from '../../../services/hostel.service';
import { HostelCardComponent } from "../../../components/hostel-card/hostel-card.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hostel-management',
  standalone: true,
  imports: [
    FormsModule,
    HostelCardComponent,
    CommonModule
],
  templateUrl: './hostel-management.component.html',
  styleUrl: './hostel-management.component.css'
})
export class HostelManagementComponent implements OnInit{
  searchQuery: string = ''
  hostels!: {'key':any}[]
  page: number = 1


  constructor(private _hostelService:HostelService){}
  ngOnInit(): void {
    this.fetchHostels()
  }

  fetchHostels() {
    this._hostelService.getAllHostel(this.page, this.searchQuery).subscribe({
      next:(res)=> {
        if (res) {
          this.hostels=res.data
        }
      },
    })
  }

  searchUser() {
    this.fetchHostels()
  }

}
