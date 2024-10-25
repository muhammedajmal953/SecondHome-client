import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { Router } from '@angular/router';
import {  Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { UserDoc } from '../../../models/IUsers';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-vendor-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './vendor-management.component.html',
  styleUrl: './vendor-management.component.css',
})
export class VendorManagementComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  users: UserDoc[] = [];
  page: number = 1;
  limit: number = 5;
  showModal: boolean = false;
  lisence: string = '';
  _id: string = '';
  count!: number;
  searchText: string = '';

  constructor(
    private _adminService: AdminService,
    private _router: Router,
    @Inject(PLATFORM_ID) private paltform_id: string
  ) {}

  ngOnInit(): void {
    let storedPage: string;

    if (isPlatformBrowser(this.paltform_id)) {
      storedPage = localStorage.getItem('avp')!;
    }
    if (storedPage!) {
      this.page = +storedPage;
    }
    this.fetchUsers();
  }

  fetchUsers() {
    if (isPlatformBrowser(this.paltform_id)) {
      localStorage.setItem('avp', this.page.toString());
      this._adminService
        .getAllVendors(this.page, this.limit, this.searchText)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (res) => {
            if (res.success) {
              this.users = res.data;
              this.count = this.users.length;
            } else {
              console.warn('Failed to fetch users');
            }
          },
          (error) => {
            Swal.fire({
              icon: 'error',
              toast: true,
              position: 'top',
              showConfirmButton: false,
              timer: 1500,
              title: error.message,
            });
            console.error('Error fetching users:', error);
          }
        );
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
      toast: true,
      icon: 'warning',
    }).then((result) => {
      if (result.isConfirmed) {
        this._adminService
          .blockUser(id)
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            (res) => {
              if (res.success) {
                Swal.fire({
                  icon: 'success',
                  title: 'User Blocked',
                  toast: true,
                  timer: 1500,
                  position: 'top',
                  showConfirmButton: false,
                });
                this.users.forEach((user) => {
                  if (user._id === id) {
                    user.IsActive = false;
                  }
                });
              }
            },
            (error) => {
              console.error('Error blocking user:', error);
            }
          );
      } else {
        console.log('');
      }
    });
  }

  unblockUser(id: string) {
    Swal.fire({
      title: 'Are you sure',
      text: 'To allow the access of User',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Block!',
      icon: 'warning',
      toast: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this._adminService
          .unBlockUser(id)
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            (res) => {
              if (res.success) {
                Swal.fire({
                  icon: 'success',
                  title: 'User UnBlocked',
                  toast: true,
                  timer: 1500,
                  position: 'top',
                  showConfirmButton: false,
                });
                this.users.forEach((user) => {
                  if (user._id === id) {
                    user.IsActive = true;
                  }
                });
              }
            },
            (error) => {
              console.error('Error unblocking user:', error);
            }
          );
      }
    });
  }

  changePage(direction: 'increment' | 'decrement') {
    if (direction === 'increment' && this.count > 0) {
      this.page++;
    } else if (direction === 'decrement' && this.page > 1) {
      this.page--;
    }

    this.fetchUsers();
  }

  giveApproval(id: string, license: string) {
    this._id = id;
    this.lisence = license;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  verifyUser() {
    if (this._id && this.lisence) {
      this._adminService
        .verifyVendor(this._id)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (res) => {
            if (res.success) {
              Swal.fire({
                icon: 'success',
                title: 'Vendor Verified',
                toast: true,
                timer: 1500,
                position: 'top',
                showConfirmButton: false,
              });
              this.users.forEach((user) => {
                if (this._id === user._id) {
                  user.isKYCVerified = true;
                }
              });
              this.showModal = false;
            }
          },
          (error) => {
            console.error('Error verifying user:', error);
            Swal.fire({
              icon: 'error',
              toast: true,
              position: 'top',
              showConfirmButton: false,
              timer: 1500,
              title: error.message,
            });
          }
        );
    }
  }

  searchUser() {
    this.fetchUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }
}
