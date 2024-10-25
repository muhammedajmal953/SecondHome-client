import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { UserService } from '../../../services/user.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ApiRes } from '../../../models/IApiRes';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { UserDoc } from '../../../models/IUsers';


interface User{
  First_name: string;
  Last_name: string;
  Email: string;
  Phone: string;
  Avatar: string
  isActive:boolean
}

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent {
  editedForm!: FormGroup
  preview!: SafeUrl
  user!: User
  user$!:Observable<UserDoc|null>
  constructor(private _userService: UserService,private _fb:FormBuilder ,private _sanitizer:DomSanitizer,private _router:Router) {
    this.editedForm = this._fb.group({
      First_name: ['', [Validators.required, Validators.pattern('^[a-zA-Z]{5,}$')]],
      Last_name: ['', [Validators.required, Validators.pattern('^[a-zA-Z]{3,}$')]],
      Email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')]],
      Phone: ['', [Validators.required, Validators.pattern('^[5-9][0-9]{9}$')]],
      avatar: [null, [this.mimeType]]
    })
  }
  ngOnInit(): void {
    this._userService.getUser().subscribe({
      next: (res:ApiRes ) => {
        if(res.success) {
          this.user = res.data
          this.editedForm.patchValue({
            First_name: this.user.First_name,
            Last_name: this.user.Last_name,
            Email: this.user.Email,
            Phone: this.user.Phone
          })
        }
      }
    })
    if (this.user.isActive===false) {
      localStorage.removeItem('user'),
      localStorage.removeItem('userRefresh')
      window.location.replace('/user')
    }
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

  onSubmit():void {
    if (this.editedForm.valid) {

      const formData = new FormData();
      formData.append('First_name', this.editedForm.get('First_name')?.value)
      formData.append('Last_name', this.editedForm.get('Last_name')?.value)
      formData.append('Email', this.editedForm.get('Email')?.value)
      formData.append('Phone', this.editedForm.get('Phone')?.value)
      formData.append('avatar', this.editedForm.get('avatar')?.value)

      console.log(formData.get('First_name'))

      this._userService.editProfile(formData).subscribe({
        next: (res => {
          if (res.success) {
            Swal.fire({
              icon: 'success',
              toast: true,
              position: 'top',
              timer: 1500,
              title:'Profile edited'
            })
            this._router.navigate(['/user/home/profile'])

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
