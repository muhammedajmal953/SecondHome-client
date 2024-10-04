import { Component } from '@angular/core';
import { HeaderNameComponent } from "../../../components/header-name/header-name.component";
import { CahangePasswordFormComponent } from "../../../components/cahange-password-form/cahange-password-form.component";
import Swal from 'sweetalert2';
import { VendorService } from '../../../services/vendor.service';
import { Router } from '@angular/router';
import { ApiRes } from '../../../models/IApiRes';

@Component({
  selector: 'app-vendor-change-password',
  standalone: true,
  imports: [HeaderNameComponent, CahangePasswordFormComponent],
  templateUrl: './vendor-change-password.component.html',
  styleUrl: './vendor-change-password.component.css'
})
export class VendorChangePasswordComponent {
  constructor(private vendorServices: VendorService,private router:Router){}
  onSubmit(password:string) {
    if (password) {
      let email = localStorage.getItem('vendorEmail')!;
      console.log('email', email);

      this.vendorServices.vendorChangePassword(email, password).subscribe((res: ApiRes) => {
        if (res.success == true) {
          Swal.fire({
            position: 'top',
            icon: 'success',
            text: res.message,
            showConfirmButton: false,
            timer: 1500,
            toast: true,
          })
          localStorage.removeItem('vendorEmail');
          this.router.navigate(['/vendor']);
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

      },
        (error) => {
          console.log(error);
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
        text: 'Please enter a valid password',
        showConfirmButton: false,
        timer: 1500,
        toast: true,
      })
    }
 }
}
