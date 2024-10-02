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
  constructor(private vendorService: VendorService, private router: Router) { }
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
      let email:string=localStorage.getItem('vendorEmail')!
      this.vendorService.verifyVendor(email, otp).subscribe((res: ApiRes) => {
        if(res.success == true&&res.data==null){
          Swal.fire({
            position: 'top',
            icon: 'success',
            text: 'OTP verified successfully you you can Change the password',
            showConfirmButton: false,
            timer: 1500,
            toast: true,
          })
          this.router.navigate(['/vendor/forgot-password/change-password'])
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
          console.log(res.data);

          localStorage.setItem('vendor', res.data)
          localStorage.removeItem('vendorEmail')
          this.router.navigate(['/vendor/sign-up/kyc'])
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
      })
    }
  }
}