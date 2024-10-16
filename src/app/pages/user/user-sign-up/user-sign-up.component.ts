import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { ApiRes } from '../../../models/IApiRes';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { HeaderNameComponent } from "../../../components/header-name/header-name.component";

@Component({
  selector: 'app-user-sign-up',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    HeaderNameComponent,
    RouterLink
],
  templateUrl: './user-sign-up.component.html',
  styleUrl: './user-sign-up.component.css'
})
export class UserSignUpComponent {
  formData:FormGroup

  constructor(private _userService:UserService, private _router:Router) {
    this.formData = new FormGroup({
      Email: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')]),
      First_name: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z]{5,}$')]),
      Last_name: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z]{3,}$')]),
      Password: new FormControl("", [
        Validators.required,
        Validators.pattern('^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$')
      ]),
      ConfirmPassword: new FormControl('', [Validators.required,]),
      Gender: new FormControl('', [Validators.required]),
      Phone: new FormControl('', [Validators.required, Validators.pattern('^[5-9][0-9]{9}$')]),

    }, {validators:this.passwordsMatchValidator});
  }


  passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('Password')?.value;
    const confirmPassword = control.get('ConfirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }



  onSubmit(): void {

    if (this.formData.valid) {
       this._userService.userRegister(this.formData.value).subscribe((res:ApiRes) => {
        const email = this.formData.value.Email;
         if (res.success == true) {
          localStorage.setItem("email", email);
          this._router.navigate(['/user/sign-up/otp'])
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
      );
      console.log(this.formData.value);


    } else {
      this.formData.markAllAsTouched();
    }
  }
}
