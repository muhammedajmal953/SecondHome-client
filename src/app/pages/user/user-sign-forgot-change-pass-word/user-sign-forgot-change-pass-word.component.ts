import { Component } from '@angular/core';
import { HeaderNameComponent } from "../../../components/header-name/header-name.component";
import { CahangePasswordFormComponent } from '../../../components/cahange-password-form/cahange-password-form.component';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { ApiRes } from '../../../models/IApiRes';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-sign-forgot-change-pass-word',
  standalone: true,
  imports: [
    HeaderNameComponent,
    CahangePasswordFormComponent

  ],
  templateUrl: './user-sign-forgot-change-pass-word.component.html',
  styleUrl: './user-sign-forgot-change-pass-word.component.css'
})
export class UserSignForgotChangePassWordComponent {
  constructor(private userService: UserService,private router:Router){}
  onSubmit(password:string) {
    if (password) {
      let email = localStorage.getItem('email')!;
      console.log('email', email);

      this.userService.userChangePassword(email, password).subscribe((res: ApiRes) => {
        if (res.success == true) {
          Swal.fire({
            position: 'top',
            icon: 'success',
            text: res.message,
            showConfirmButton: false,
            timer: 1500,
            toast: true,
          })
          localStorage.removeItem('email');
          this.router.navigate(['/user']);
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
