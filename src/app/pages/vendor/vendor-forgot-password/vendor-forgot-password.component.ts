import { Component } from '@angular/core';
import { HeaderNameComponent } from "../../../components/header-name/header-name.component";
import { ForgotPasswordFormComponent } from "../../../components/forgot-password-form/forgot-password-form.component";
import Swal from 'sweetalert2';
import { VendorService } from '../../../services/vendor.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vendor-forgot-password',
  standalone: true,
  imports: [HeaderNameComponent, ForgotPasswordFormComponent],
  templateUrl: './vendor-forgot-password.component.html',
  styleUrl: './vendor-forgot-password.component.css'
})
export class VendorForgotPasswordComponent {
  constructor(private router:Router,private vendorServices:VendorService) {
  }
  onSubmit(formData: any): void {
    if (formData) {

      this.vendorServices.vendorForgotPassword(formData).subscribe((res) => {

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
          this.router.navigate(['/vendor/forgot-password/otp']);
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
