import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { patters } from '../../../shared/constants/regexConstants';
import { Store } from '@ngrx/store';
import * as UserActions from '../../../state/user/user.actions';
import * as UserSelectors from '../../../state/user/user.selector';
import { UserDoc } from '../../../models/IUsers';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hostel-reviews',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './hostel-reviews.component.html',
  styleUrl: './hostel-reviews.component.css',
})
export class HostelReviewsComponent implements OnInit{
  user$: Observable<UserDoc | null>
  user: UserDoc | null = null
  hostelId!:string
  reviews:any
  reviewForm!: FormGroup;
  constructor(
    private _userService: UserService,
    private _activatedRoute: ActivatedRoute,
    private store: Store
  ) {
    this.reviewForm = new FormGroup({
      rating:new FormControl(0,[Validators.required,Validators.min(1)]),
      review:new FormControl('',[Validators.required,Validators.pattern(patters.TEXT_CONTENT)])
    });
    this.user$=this.store.select(UserSelectors.selectUser)
  }

  ngOnInit(): void {
    this.store.dispatch(UserActions.loadUserActions())
    this.user$.subscribe((res) => {
      if (res) {
        this.user=res
      }
      if (this.user?.IsActive === false) {
        Swal.fire({
          icon: 'error',
          toast: true,
          text:'You are Blocked By Admin'
        })
        this.store.dispatch(UserActions.logout())
      }
    }, error => {
      Swal.fire({
        position: 'top',
        icon: 'error',
        text: error.error.message,
        showConfirmButton: false,
        timer: 1500,
        toast: true,
      });
    })
    this._activatedRoute.params.subscribe(params => {
      this.fetchReview(params['id'])
      this.hostelId=params['id']
    })
  }
  setRating(rating: number) {
    this.reviewForm.get('rating')?.setValue(rating)

    this.reviewForm.updateValueAndValidity()
  }

  onSubmit() {
    if (this.reviewForm.valid) {
      const { rating, review } = this.reviewForm.value;
      const newReview = {
        rating,
        review,
      };

      this._userService.addReview(newReview, this.user!._id, this.hostelId).subscribe({
        next: (res)=>{
          if (res.success) {
            this.reviews=res.data.reviews
          }
        }
      })
    }
  }

  fetchReview(id:string) {
    this._userService.getReview(id).subscribe({
      next: (res) => {
        if (res.success) {
          this.reviews=res.data.reviews
        }
      },
      error: (err) => {
        console.log(err);
      },
      complete: ()=>{

      }
    })
  }
}
