import {Component, Inject, OnDestroy, OnInit,PLATFORM_ID } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { Router } from '@angular/router';
import { Subject, Subscription, takeUntil} from 'rxjs';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { UserDoc } from '../../../models/IUsers';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit,OnDestroy {
  destroy$=new Subject<void>()
  users: UserDoc[] = [];
  page: number = 1;
  limit: number = 5;
  searchQuery: string = ''
  count!:number

  constructor(private _adminService: AdminService, private _router: Router, @Inject(PLATFORM_ID) private paltform_id:string) {}

  ngOnInit(): void {
    let storedPage: string

    if (isPlatformBrowser(this.paltform_id)) {
      storedPage= localStorage.getItem('aup')!;
    }
    if (storedPage!) {
      this.page = +storedPage;
    }
    this.fetchUsers();
  }

  fetchUsers() {
    if (isPlatformBrowser(this.paltform_id)) {
      localStorage.setItem('aup', this.page.toString());
      this._adminService.getAllUsers(this.page, this.limit,this.searchQuery).pipe(takeUntil(this.destroy$)).subscribe((res) => {
        if (res.success) {
          this.users = res.data;
          this.count=this.users.length
        } else {
          console.warn('Failed to fetch users');
        }
      }, (error) => {
        console.error('Error fetching users:', error);

        if (error.error.message === 'Please login') {
          localStorage.removeItem('admin')
          this._router.navigate(['/admin'])
        }
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
      icon: 'warning',
      toast:true
    }).then((result) => {

      if (result.isConfirmed) {
        this._adminService.blockUser(id).pipe(takeUntil(this.destroy$)).subscribe((res) => {
          if (res.success) {
            Swal.fire({
              icon: 'success',
              title: 'User Blocked',
              toast:true,
              timer: 1500,
              position: 'top',
              showConfirmButton:false
            })
            this.users.forEach((user) => {
              if (user._id === id) {
                user.IsActive=false
              }
            })
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
      toast:true,
      icon:'warning'
    }).then((result) => {
      if (result.isConfirmed) {
        this._adminService.unBlockUser(id).pipe(takeUntil(this.destroy$)).subscribe((res) => {
          if (res.success) {
            Swal.fire({
              icon: 'success',
              title: 'User UnBlocked',
              toast:true,
              timer: 1500,
              position: 'top',
              showConfirmButton:false
            })
            this.users.forEach((user) => {
              if (user._id === id) {
                user.IsActive=true
              }
            })
          }
        }, (error) => {
          console.error('Error unblocking user:', error);
          Swal.fire({
            position: 'top',
            icon: 'error',
            text: error.error.message,
            showConfirmButton: false,
            timer: 1500,
            toast: true,
          });
        });
      }
    })
  }

  changePage(direction: 'increment' | 'decrement') {
    if (direction === 'increment'&&this.count>0) {
      this.page++;
    } else if (direction === 'decrement' && this.page > 1) {
      this.page--;
    }

    this.fetchUsers();
  }


  searchUser() {
    this.fetchUsers()
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }
}

