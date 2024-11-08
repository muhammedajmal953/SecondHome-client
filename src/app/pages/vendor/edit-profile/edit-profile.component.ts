import { Component, OnDestroy, OnInit } from '@angular/core';
import { VendorService } from '../../../services/vendor.service';
import { ApiRes } from '../../../models/IApiRes';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ImageCropperComponent, LoadedImage } from 'ngx-image-cropper';
import { SafeUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { UserDoc } from '../../../models/IUsers';
import * as VendorSelector from '../../../state/vendor/vendor.selecters';
import * as VendorActions from '../../../state/vendor/vendor.actions';
import { patters } from '../../../shared/constants/regexConstants';

interface User {
  First_name: string;
  Last_name: string;
  Email: string;
  Phone: string;
  Avatar: string;
}

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css',
})
export class EditProfileComponent implements OnInit,OnDestroy {
  editedForm!: FormGroup;
  preview!: SafeUrl;
  user!: User;
  vendor$!: Observable<UserDoc | null>;
  destroy$=new Subject<void>()

  constructor(
    private _vendorService: VendorService,
    private _fb: FormBuilder,
    private _router: Router,
    private _store: Store
  ) {
    this.editedForm = this._fb.group({
      First_name: [
        '',
        [Validators.required, Validators.pattern(patters.FIRST_NAME)],
      ],
      Last_name: [
        '',
        [Validators.required, Validators.pattern(patters.LAST_NAME)],
      ],
      Email: [
        '',
        [
          Validators.required,
          Validators.pattern(patters.EMAIL),
        ],
      ],
      Phone: ['', [Validators.required, Validators.pattern(patters.PHONE)]],
      avatar: [null, [this.mimeType]],
    });
  }
  ngOnInit(): void {
    this._store.dispatch(VendorActions.loadVendor());

    this.vendor$ = this._store.select(VendorSelector.selectVendor);

    this.vendor$.pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
      if (data) {
        this.user = data;
        this.editedForm.patchValue({
          First_name: this.user.First_name,
          Last_name: this.user.Last_name,
          Email: this.user.Email,
          Phone: this.user.Phone,
        });
      }
    });
  }

  onPhotoChange(event: any) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.item(0);

    if (file) {
      this.editedForm.patchValue({
        avatar: file,
      });
      console.log(file);

      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.preview = event.target.result as SafeUrl;
      };
      reader.readAsDataURL(file);

      this.editedForm.get('avatar')?.updateValueAndValidity();
    }
  }

  mimeType(control: FormControl): ValidationErrors | null {
    const file = control.value;
    if (file && typeof file === 'object') {
      const validMimes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      if (!validMimes.includes(file.type)) {
        return { mimeType: true };
      }
    }
    return null;
  }

  onSubmit() {
    if (this.editedForm.valid) {
      const formData = new FormData();
      formData.append('First_name', this.editedForm.get('First_name')?.value);
      formData.append('Last_name', this.editedForm.get('Last_name')?.value);
      formData.append('Email', this.editedForm.get('Email')?.value);
      formData.append('Phone', this.editedForm.get('Phone')?.value);
      formData.append('avatar', this.editedForm.get('avatar')?.value);

      console.log(formData);

      this._vendorService.vendorEditProfile(formData).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res) => {
          if (res.success) {
            Swal.fire({
              icon: 'success',
              toast: true,
              position: 'top',
              timer: 1500,
              title: 'Profile edited',
            });
            this._router.navigate(['/vendor/home/profile']);
          } else {
            Swal.fire({
              icon: 'error',
              title: res.message,
            });
          }
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: err.error.message,
          });
        },
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }
}
