import { Component } from '@angular/core';
import { CahangePasswordFormComponent } from "../../../components/cahange-password-form/cahange-password-form.component";
import Swal from 'sweetalert2';
import { VendorService } from '../../../services/vendor.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CahangePasswordFormComponent],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
  constructor(private router:Router,private vendorService:VendorService) {

  }
  submitForm(event:Event) {
    if (event) {
      this.vendorService.changePassword(event).subscribe({
        next: (res)=>{
          if (res.success) {
            Swal.fire({
              icon: 'success',
              title: res.message,
              position: 'top',
              toast: true,
              showConfirmButton: false,
              timer:1500
            })
            this.router.navigate(['/vendor/home/profile'])
          } else {

          }
        },
        error: (res) => {
          Swal.fire({
            icon: 'error',
            title: res.message,
            position: 'top',
            toast: true,
            showConfirmButton: false,
            timer:1500
          })
        }
      })

    }
  }
}
