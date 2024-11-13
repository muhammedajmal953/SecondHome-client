import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { ApiRes } from '../../../models/IApiRes';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { HeaderNameComponent } from '../../../components/header-name/header-name.component';
import { patters } from '../../../shared/constants/regexConstants';
import { FcmService } from '../../../services/fcm.service';

@Component({
  selector: 'app-user-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HeaderNameComponent, RouterLink],
  templateUrl: './user-sign-up.component.html',
  styleUrl: './user-sign-up.component.css',
})
export class UserSignUpComponent {
  formData: FormGroup;
  fcmToken!: string | null;

  constructor(private _userService: UserService, private _router: Router,private _fcmService:FcmService) {
    this.formData = new FormGroup(
      {
        Email: new FormControl('', [
          Validators.required,
          Validators.pattern(patters.EMAIL),
        ]),
        First_name: new FormControl('', [
          Validators.required,
          Validators.pattern(patters.FIRST_NAME),
        ]),
        Last_name: new FormControl('', [
          Validators.required,
          Validators.pattern(patters.LAST_NAME),
        ]),
        Password: new FormControl('', [
          Validators.required,
          Validators.pattern(patters.PASSWORD),
        ]),
        ConfirmPassword: new FormControl('', [Validators.required]),
        Gender: new FormControl('', [Validators.required]),
        Phone: new FormControl('', [
          Validators.required,
          Validators.pattern(patters.PHONE),
        ]),
        fcmToken:new FormControl('')
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('Password')?.value;
    const confirmPassword = control.get('ConfirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  onSubmit(): void {
    if (this.formData.valid) {
      this._fcmService.requestPermission().subscribe(
        (token) => {
          if (token) {
            this.fcmToken = token;
            this.formData.get('fcmToken')?.setValue(token)
            console.log('Fcm Token:', this.formData.value);
          } else {
            console.log('No FCM token received.');
          }
        },
        (error) => {
          console.error('Fcm vendor token', error);
        },
        () => {}
      );



      this._userService.userRegister(this.formData.value).subscribe({
        next: (res: ApiRes) => {
          const email = this.formData.value.Email;
          if (res.success == true) {
            localStorage.setItem('email', email);
            this._router.navigate(['/user/sign-up/otp']);
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
        error: (error) => {
          console.log(error);
          Swal.fire({
            position: 'top',
            icon: 'error',
            text: error.error.message,
            showConfirmButton: false,
            timer: 1500,
            toast: true,
          });
        },
        complete: () => {},
      });
      console.log(this.formData.value);
    } else {
      this.formData.markAllAsTouched();
    }
  }
}
