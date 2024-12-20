import { Component, OnDestroy } from '@angular/core';
import { HeaderNameComponent } from '../../../components/header-name/header-name.component';
import { CahangePasswordFormComponent } from '../../../components/cahange-password-form/cahange-password-form.component';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { ApiRes } from '../../../models/IApiRes';
import Swal from 'sweetalert2';
import { ResetPasswordComponent } from '../../../components/reset-password/reset-password.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-sign-forgot-change-pass-word',
  standalone: true,
  imports: [
    HeaderNameComponent,
    CahangePasswordFormComponent,
    ResetPasswordComponent,
  ],
  templateUrl: './user-sign-forgot-change-pass-word.component.html',
  styleUrl: './user-sign-forgot-change-pass-word.component.css',
})
export class UserSignForgotChangePassWordComponent implements OnDestroy{
  private subsription:Subscription=new Subscription()
  constructor(private _userService: UserService, private _router: Router) {}
  onSubmit(password: string) {
    if (password) {
      let email = localStorage.getItem('email')!;
      console.log('email', email);

      this.subsription=this._userService.userChangePassword(email, password).subscribe(
        (res: ApiRes) => {
          if (res.success == true) {
            Swal.fire({
              position: 'top',
              icon: 'success',
              text: res.message,
              showConfirmButton: false,
              timer: 1500,
              toast: true,
            });
            localStorage.removeItem('email');
            this._router.navigate(['/user']);
          } else {
            Swal.fire({
              position: 'top',
              icon: 'error',
              text: res.message,
              showConfirmButton: false,
              timer: 1500,
              toast: true,
            });
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
          });
        }
      );
    } else {
      Swal.fire({
        position: 'top',
        icon: 'error',
        text: 'Please enter a valid password',
        showConfirmButton: false,
        timer: 1500,
        toast: true,
      });
    }
  }
  ngOnDestroy(): void {
    this.subsription.unsubscribe()
  }
}
