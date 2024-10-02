import {Component, Inject, OnInit,PLATFORM_ID } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { Router } from '@angular/router';
import { Observable} from 'rxjs';
import { ApiRes } from '../../../models/IApiRes';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { UserDoc } from '../../../models/IUsers';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit {
  users$: Observable<ApiRes> | undefined;
  users: UserDoc[] = [];
  page: number = 1;
  limit: number = 5;

  constructor(private adminService: AdminService, private router: Router, @Inject(PLATFORM_ID) private paltform_id:string) {}

  ngOnInit(): void {
    let storedPage: string

    if (isPlatformBrowser(this.paltform_id)) {
      storedPage= localStorage.getItem('page')!;
    }
    if (storedPage!) {
      this.page = +storedPage;
    }
    this.fetchUsers();
  }

  fetchUsers() {
    if (isPlatformBrowser(this.paltform_id)) {
      localStorage.setItem('page', this.page.toString());
      this.adminService.getAllUsers(this.page, this.limit).subscribe((res) => {
        if (res.success) {
          this.users = res.data;
        } else {
          console.warn('Failed to fetch users');
        }
      }, (error) => {
        console.error('Error fetching users:', error);
      });
   }
  }

  blockUser(id: string) {
    Swal.fire({
      title: 'Are you sure',
      text: 'To restrict the access the of User',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Block!',
      icon:'warning'
    }).then((result) => {

      if (result.isConfirmed) {
        this.adminService.blockUser(id).subscribe((res) => {
          if (res.success) {
            Swal.fire({
              icon: 'success',
              title: 'User Blocked',
              toast:true,
              timer: 1500,
              position: 'top',
              showConfirmButton:false
            })
            this.fetchUsers();
          }
        }, (error) => {
          console.error('Error blocking user:', error);
        });
      } else {

        console.log('')
      }
    })
  }

  unblockUser(id: string) {
    Swal.fire({
      title: 'Are you sure',
      text: 'To allow the access of User',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Block!',
      icon:'warning'
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.unBlockUser(id).subscribe((res) => {
          if (res.success) {
            Swal.fire({
              icon: 'success',
              title: 'User UnBlocked',
              toast:true,
              timer: 1500,
              position: 'top',
              showConfirmButton:false
            })
            this.fetchUsers();
          }
        }, (error) => {
          console.error('Error unblocking user:', error);
        });
      }
    })
  }

  changePage(direction: 'increment' | 'decrement') {
    if (direction === 'increment') {
      this.page++;
    } else if (direction === 'decrement' && this.page > 1) {
      this.page--;
    }

    this.fetchUsers();
  }
}

