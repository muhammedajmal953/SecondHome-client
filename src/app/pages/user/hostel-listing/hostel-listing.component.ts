import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { HostelService } from '../../../services/hostel.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { WishlistService } from '../../../services/wishlist.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-hostel-listing',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './hostel-listing.component.html',
  styleUrl: './hostel-listing.component.css',
})
export class HostelListingComponent implements OnInit {
  constructor(
    private _hostelService: HostelService,
    private _router: Router,
    @Inject(PLATFORM_ID) private platform_id: string,
    private _wishlistServices: WishlistService
  ) {
    this.filterForm = new FormGroup({
      bedtype: new FormControl(),
      category: new FormControl(),
    });
  }

  filterForm!: FormGroup;
  hostels: any[] = [];
  searchQuery: string = '';
  page: number = 1;
  count!: number;
  sortValue:string=''
  private _searchSubject = new Subject<string>();

  ngOnInit(): void {
    let storedPage: string;

    if (isPlatformBrowser(this.platform_id)) {
      storedPage = localStorage.getItem('uhp')!;
    }
    if (storedPage!) {
      this.page = +storedPage;
    }
    this.fetchHostels(this.sortValue,this.filterForm.value);

    this._searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((searchTerm) => {
        this.searchQuery = searchTerm;
        this.page = 1;
        this.fetchHostels(this.sortValue,this.filterForm.value);
      });
  }

  changePage(direction: 'increment' | 'decrement') {
    if (direction === 'increment' && this.count > 0) {
      this.page++;
    } else if (direction === 'decrement' && this.page > 1) {
      this.page--;
    }
    this.fetchHostels(this.sortValue,this.filterForm.value);
  }

  fetchHostels(sort:string,filter:Record<string,unknown>) {
    localStorage.setItem('uhp', this.page.toString());
    this._hostelService.getAllHostel(this.page, this.searchQuery,filter,sort).subscribe({
      next: (res) => {
        if (res.success) {
          this.hostels = res.data;
          this.count = this.hostels.length;
        } else {
          Swal.fire({
            icon: 'error',
            text: 'Internal server error',
          });
        }
      },
      error: (error) => {
        Swal.fire({
          position: 'top',
          icon: 'error',
          text: error.error.message,
          showConfirmButton: false,
          timer: 1500,
          toast: true,
        });

        if (error.error.message === 'Please login') {
          localStorage.removeItem('user')
          this._router.navigate(['/user'])
        }
      },
      complete: () => {},
    });
  }

  searchButton(searchTerm: Event) {
    const target = searchTerm.target as HTMLInputElement;

    const value = target.value;
    this._searchSubject.next(value);
  }

  showHostel(id: string) {
    this._router.navigate([`/user/home/hostelDetails/${id}`]);
  }

  addToWishlist(id: string) {
    this._wishlistServices.addToWishList(id).subscribe({
      next: (res) => {
        if (res.success) {
          Swal.fire({
            icon: 'success',
            toast: true,
            text: res.message,
            position: 'top',
            showConfirmButton: false,
            width: 'full',
            timer: 1500,
          });
        }
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          toast: true,
          text: err.error.message,
          position: 'top',
          showConfirmButton: false,
          width: 'full',
          timer: 1500,
        });
      },
      complete: () => {
        console.log('wish list adding completed');
      },
    });
  }

  sort(event: Event) {
    const target = event.target as HTMLSelectElement
    const sortValue = target.value
    this.sortValue=sortValue
    this.fetchHostels(this.sortValue,this.filterForm.value)

  }

  filter() {


    this.fetchHostels(this.sortValue,this.filterForm.value)
    console.log(this.filterForm.value);
  }
}
