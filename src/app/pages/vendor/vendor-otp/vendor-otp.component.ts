import { Component } from '@angular/core';
import { HeaderNameComponent } from "../../../components/header-name/header-name.component";
import { OtpFormComponent } from "../../../components/otp-form/otp-form.component";
import Swal from 'sweetalert2';
import { ApiRes } from '../../../models/IApiRes';
import { Router } from '@angular/router';
import { VendorService } from '../../../services/vendor.service';

@Component({
  selector: 'app-vendor-otp',
  standalone: true,
  imports: [HeaderNameComponent, OtpFormComponent],
  templateUrl: './vendor-otp.component.html',
  styleUrl: './vendor-otp.component.css'
})
export class VendorOtpComponent {
  constructor(private _vendorService: VendorService, private _router: Router) { }
  onSubmit(otp:string) {

    if (otp.length !== 6) {
      Swal.fire({
        position: 'top',
        icon: 'error',
        text: 'Please enter a valid OTP',
        showConfirmButton: false,
        timer: 1500,
        toast: true,
      });
    } else {
      let email: string = localStorage.getItem('vendorEmail')!
      console.log(email);

      this._vendorService.verifyVendor(email, otp).subscribe({next:(res: ApiRes) => {
        if (res.success == true && res.data == null) {
          Swal.fire({
            position: 'top',
            icon: 'success',
            text: 'OTP verified successfully you you can Change the password',
            showConfirmButton: false,
            timer: 1500,
            toast: true,
          })
          this._router.navigate(['/vendor/forgot-password/change-password'])
        }
        else if (res.success == true) {
          Swal.fire({
            position: 'top',
            icon: 'success',
            text: 'OTP verified successfully',
            showConfirmButton: false,
            timer: 1500,
            toast: true,
          })
          localStorage.setItem('vendor', res.data.token)
          localStorage.setItem('vendorRefresh', res.data.refreshToken)
          this._router.navigate(['/vendor/sign-up/kyc'])
        } else {
          Swal.fire({
            position: 'top',
            icon: 'error',
            text: res.message,
            showConfirmButton: false,
            timer: 1500,
            toast: true,
          })
        }
      }, error: (error) => {
        Swal.fire({
          position: 'top',
          icon: 'error',
          text: error.error.message || 'Something went wrong',
          showConfirmButton: false,
          timer: 1500,
          toast: true,
        });
        },
        complete:()=>{}
    })
    }
  }

  resendOtp() {
    let email = localStorage.getItem('vendorEmail');
    this._vendorService.resendOtp(email!).subscribe({
      next: (res) => {
        if (res.success) {
          console.log(res.message)
        }
      }, error: (res) => {
        Swal.fire({
          position: 'top',
          toast: true,
          showConfirmButton: false,
          title: 'error in resending Otp',
          timer: 1500,
          icon:'error'
        })
      },complete:()=>{}
    })
  }

}
