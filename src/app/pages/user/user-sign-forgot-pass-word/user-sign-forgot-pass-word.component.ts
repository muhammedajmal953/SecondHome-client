import { Component } from '@angular/core';
import { HeaderNameComponent } from "../../../components/header-name/header-name.component";
import { ForgotPasswordFormComponent } from "../../../components/forgot-password-form/forgot-password-form.component";
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-sign-forgot-pass-word',
  standalone: true,
  imports: [HeaderNameComponent, ForgotPasswordFormComponent],
  templateUrl: './user-sign-forgot-pass-word.component.html',
  styleUrl: './user-sign-forgot-pass-word.component.css'
})
export class UserSignForgotPassWordComponent {
  constructor(private router:Router,private userServices:UserService) {
  }
  onSubmit(formData: any): void {
    if (formData) {

      this.userServices.forgotPassword(formData).subscribe((res) => {

        if (!res.success) {
          Swal.fire({
            position: 'top',
            icon: 'error',
            text: res.message,
            showConfirmButton: false,
            timer: 1500,
            toast: true,
          });
        } else {
          Swal.fire({
            position: 'top',
            icon: 'success',
            text: res.message,
            showConfirmButton: false,
            timer: 1500,
            toast: true,
          });
          localStorage.setItem('email', formData.Email);
          this.router.navigate(['/user/forgot-password/otp']);
        }
      },
        (error) => {
          Swal.fire({
            position: 'top',
            icon: 'error',
            text: error.error.message,
            showConfirmButton: false,
            timer: 1500,
            toast: true,
          })
        }
      )
    } else {
      Swal.fire({
        position: 'top',
        icon: 'error',
        text: 'Please enter your email',
        showConfirmButton: false,
        timer: 1500,
        toast: true,
      })
    }
  }
}