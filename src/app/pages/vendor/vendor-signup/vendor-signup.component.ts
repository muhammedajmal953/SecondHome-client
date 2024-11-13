import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule,
} from '@angular/forms';
import { VendorService } from '../../../services/vendor.service';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { ApiRes } from '../../../models/IApiRes';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { HeaderNameComponent } from '../../../components/header-name/header-name.component';
import { patters } from '../../../shared/constants/regexConstants';
import { FcmService } from '../../../services/fcm.service';
@Component({
  selector: 'app-vendor-signup',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HeaderNameComponent, RouterLink],
  templateUrl: './vendor-signup.component.html',
  styleUrl: './vendor-signup.component.css',
})
export class VendorSignupComponent {
  formData: FormGroup;
  fcmToken!:string|null

  constructor(private _vendorService: VendorService, private _router: Router,private _fcmService:FcmService) {
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
          Validators.pattern(
           patters.PASSWORD
          ),
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

      this._vendorService.vendorRegister(this.formData.value).subscribe({
        next: (res: ApiRes) => {
          const email = this.formData.value.Email;
          if (res.success == true) {
            localStorage.setItem('vendorEmail', email);
            this._router.navigate(['/vendor/sign-up/otp']);
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
        }, error: (error) => {
          Swal.fire({
            position: 'top',
            icon: 'error',
            text: error.error.message,
            showConfirmButton: false,
            timer: 1500,
            toast: true,
          });
        }
        , complete: () => { }
      });
      console.log(this.formData.value);
    } else {
      this.formData.markAllAsTouched();
    }
  }
}

