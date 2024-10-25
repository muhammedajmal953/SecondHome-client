import { Component, OnDestroy } from '@angular/core';
import { HeaderNameComponent } from "../../../components/header-name/header-name.component";
import { ForgotPasswordFormComponent } from "../../../components/forgot-password-form/forgot-password-form.component";
import Swal from 'sweetalert2';
import { VendorService } from '../../../services/vendor.service';
import { Router } from '@angular/router';
import { ResetPasswordComponent } from "../../../components/reset-password/reset-password.component";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-vendor-forgot-password',
  standalone: true,
  imports: [HeaderNameComponent, ForgotPasswordFormComponent, ResetPasswordComponent],
  templateUrl: './vendor-forgot-password.component.html',
  styleUrl: './vendor-forgot-password.component.css'
})
export class VendorForgotPasswordComponent implements OnDestroy{
  private subscription:Subscription=new Subscription()
  constructor(private _router:Router,private _vendorServices:VendorService) {
  }
  onSubmit(formData: any): void {
    if (formData) {

      this.subscription=this._vendorServices.vendorForgotPassword(formData).subscribe((res) => {

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
          localStorage.setItem('vendorEmail', formData.Email);
          this._router.navigate(['/vendor/forgot-password/otp']);
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
  ngOnDestroy(): void {
    if (this.subscription) {
        this.subscription.unsubscribe()
      }
  }
  
}
