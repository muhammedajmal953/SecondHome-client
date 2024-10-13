import { Component, OnInit } from '@angular/core';
import { VendorService } from '../../../services/vendor.service';
import { ApiRes } from '../../../models/IApiRes';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import {ImageCropperComponent,LoadedImage} from "ngx-image-cropper";
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { log } from 'node:console';


interface User{
  First_name: string;
  Last_name: string;
  Email: string;
  Phone: string;
  Avatar:string
}

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    ImageCropperComponent,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent implements OnInit{
  editedForm!: FormGroup
  preview!: SafeUrl
  user!: User

  constructor(private vendorService: VendorService,private fb:FormBuilder ,private sanitizer:DomSanitizer,private router:Router) {
    this.editedForm = this.fb.group({
      First_name: ['', [Validators.required, Validators.pattern('^[a-zA-Z]{5,}$')]],
      Last_name: ['', [Validators.required, Validators.pattern('^[a-zA-Z]{3,}$')]],
      Email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')]],
      Phone: ['', [Validators.required, Validators.pattern('^[5-9][0-9]{9}$')]],
      avatar: [null, [this.mimeType]]
    })
  }
  ngOnInit(): void {
    this.vendorService.vendorDetails().subscribe({
      next: (res:ApiRes) => {
        if(res.success) {
          this.user = res.data
          this.editedForm.patchValue({
            First_name: this.user.First_name,
            Last_name: this.user.Last_name,
            Email: this.user.Email,
            Phone: this.user.Phone
          })
          console.log(this.user);


        }
      }
    })
  }


  onPhotoChange(event:any) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.item(0)

    if (file) {
      this.editedForm.patchValue({
        avatar: file
      })
      console.log(file);


      const reader = new FileReader()
      reader.onload = (event:any) => {
        this.preview = event.target.result as SafeUrl
      }
      reader.readAsDataURL(file)

      this.editedForm.get('avatar')?.updateValueAndValidity()
    }
  }

  mimeType(control: FormControl):ValidationErrors|null {
    const file = control.value;
    if (file && typeof file === 'object') {
      const validMimes = ['image/jpeg','image/png','image/jpg','image/webp']
      if (!validMimes.includes(file.type)) {
        return {mimeType:true}
      }

    }
    return null
  }

  onSubmit() {
    if (this.editedForm.valid) {

      const formData = new FormData();
      formData.append('First_name', this.editedForm.get('First_name')?.value)
      formData.append('Last_name', this.editedForm.get('Last_name')?.value)
      formData.append('Email', this.editedForm.get('Email')?.value)
      formData.append('Phone', this.editedForm.get('Phone')?.value)
      formData.append('avatar', this.editedForm.get('avatar')?.value)

      console.log(formData)

      this.vendorService.vendorEditProfile(formData).subscribe({
        next: (res => {
          if (res.success) {
            Swal.fire({
              icon: 'success',
              toast: true,
              position: 'top',
              timer: 1500,
              title:'Profile edited'
            })
            this.router.navigate(['/vendor/home/profile'])

          } else {
            Swal.fire({
              icon: 'error',
              title:res.message
            })
            console.log(res.message);

          }
        }), error: (err => {
          Swal.fire({
            icon: 'error',
            title: err.message
          })

        })
      })



    }

  }
}
