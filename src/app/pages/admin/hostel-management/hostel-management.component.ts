import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HostelService } from '../../../services/hostel.service';
import { HostelCardComponent } from '../../../components/hostel-card/hostel-card.component';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../services/admin.service';
import Swal from 'sweetalert2';
import { Hostels } from '../../../models/IHostel';

@Component({
  selector: 'app-hostel-management',
  standalone: true,
  imports: [FormsModule, HostelCardComponent, CommonModule],
  templateUrl: './hostel-management.component.html',
  styleUrl: './hostel-management.component.css',
})
export class HostelManagementComponent implements OnInit {
  searchQuery: string = '';
  hostels!: Hostels[];
  page: number = 1;
  buttonName!: string;

  constructor(
    private _hostelService: HostelService,
    private _adminService: AdminService
  ) {}
  ngOnInit(): void {
    this.fetchHostels();
  }

  fetchHostels() {
    this._adminService.getAllHostel(this.page, this.searchQuery).subscribe({
      next: (res) => {
        if (res) {
          this.hostels = res.data;
        }
      },
    });
  }

  searchUser() {
    this.fetchHostels();
  }

  manageHostel(event: { id: string; isActive: boolean }) {
    if (event.isActive === true) {
      Swal.fire({
        icon: 'warning',
        title: 'Are You Sure?',
        text: 'Block the Hostel',
        toast:true,
        showCancelButton: true,
        confirmButtonText: 'Yes,Block',
        cancelButtonText: 'No, cancel',
        buttonsStyling: true,
      }).then((result) => {
        if (result.isConfirmed) {
          this._adminService.blockHostel(event.id).subscribe({
            next: (res) => {
              if (res.success) {
                Swal.fire({
                  icon: 'success',
                  toast: true,
                  text: res.message,
                  showConfirmButton: false,
                  timer: 1500,
                  position:'top',
                });
                this.hostels.forEach((hostel) => {
                  if (hostel?._id === event.id) {
                    hostel.isActive = false;
                  }
                });
              }
            },
          });
        }
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Are You Sure?',
        text: 'Un Block the Hostel',
        toast: true,
        showCancelButton: true,
        confirmButtonText: 'Yes,Block',
        cancelButtonText: 'No, cancel',
        buttonsStyling: true,
      }).then((result) => {
        if (result.isConfirmed) {

          this._adminService.unBlockHostel(event.id).subscribe({
            next: (res) => {
              if (res.success) {
                Swal.fire({
                  icon: 'success',
                  toast: true,
                  text: res.message,
                  showConfirmButton: false,
                  timer: 1500,
                  position:'top',
                });
                this.hostels.forEach((hostel) => {
                  if (hostel?._id === event.id) {
                    hostel.isActive = true;
                  }
                });
              }
            },
          });
        }
      })

    }
  }
}
