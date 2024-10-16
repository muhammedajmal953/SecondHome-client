import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { Router } from '@angular/router';
import { LoginUser } from '../../../models/IUsers';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

  ],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent {
  formdata:FormGroup
  loggedIn:boolean=false
  constructor(private _adminService: AdminService, private _router: Router) {

    this.formdata =new FormGroup({
      Email: new FormControl<string | null>("",
        [Validators.required,
          Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
        ]),
      Password: new FormControl<string|null>("", [
        Validators.required,
        Validators.pattern('^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$')
      ])
    })
  }


  onSubmit(): void {

      if (this.formdata.valid) {
        let data: LoginUser = {
          Email: this.formdata.value.Email!,
          Password: this.formdata.value.Password!
        }

        this._adminService.adminLogin(data).subscribe((res)=>{
          if (!res.success) {
            Swal.fire({
              position: 'top',
              icon: 'error',
              title: 'Login failed',
              text: res.message,
              showConfirmButton: false,
              timer: 1500,
              toast: true,
            })
          } else {
            Swal.fire({
              position: 'top',
              icon: 'success',
              title: 'Login success',
              text: res.message,
              showConfirmButton: false,
              timer: 1500,
              toast: true,
            })
            localStorage.setItem('admin', res.data.token)
            localStorage.setItem('adminRefresh',res.data.refreshToken)
            this.loggedIn=true
            this._router.navigate(['/admin/home'])

          }
        })
      } else{
        this.formdata.markAllAsTouched();
      }
    }

}
