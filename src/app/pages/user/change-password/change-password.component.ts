import { Component } from '@angular/core';
import { CahangePasswordFormComponent } from "../../../components/cahange-password-form/cahange-password-form.component";
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CahangePasswordFormComponent],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {

  constructor(private _router: Router, private _userService: UserService) { }

  submitForm(event:Event) {
    if (event) {
      this._userService.changePassword(event).subscribe({
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
            this._router.navigate(['/user/home/profile'])
          } else {
            Swal.fire({
              icon: 'error',
              title: res.message,
              position: 'top',
              toast: true,
              showConfirmButton: false,
              timer:1500
            })
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
