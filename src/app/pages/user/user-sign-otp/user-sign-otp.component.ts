import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { ApiRes } from '../../../models/IApiRes';
import { HeaderNameComponent } from "../../../components/header-name/header-name.component";
import { OtpFormComponent } from "../../../components/otp-form/otp-form.component";

@Component({
  selector: 'app-user-sign-otp',
  standalone: true,
  imports: [HeaderNameComponent, OtpFormComponent],
  templateUrl: './user-sign-otp.component.html',
  styleUrl: './user-sign-otp.component.css'
})
export class UserSignOtpComponent {

  constructor(private userService: UserService, private router: Router) { }
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
      let email:string=localStorage.getItem('email')!
      this.userService.verifyUser(email, otp).subscribe((res: ApiRes) => {
        if(res.success == true&&res.data==null){
          Swal.fire({
            position: 'top',
            icon: 'success',
            text: 'OTP verified successfully you you can Change the password',
            showConfirmButton: false,
            timer: 1500,
            toast: true,
          })
          this.router.navigate(['/user/forgot-password/change-password'])
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

          localStorage.setItem('user', res.data)
          localStorage.removeItem('email')
          this.router.navigate(['/user/user-home'])
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
