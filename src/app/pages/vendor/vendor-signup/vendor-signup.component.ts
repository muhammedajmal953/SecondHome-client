import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { VendorService } from '../../../services/vendor.service';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { ApiRes } from '../../../models/IApiRes';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { HeaderNameComponent } from "../../../components/header-name/header-name.component";
@Component({
  selector: 'app-vendor-signup',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    HeaderNameComponent,
    RouterLink
],
  templateUrl: './vendor-signup.component.html',
  styleUrl: './vendor-signup.component.css'
})
export class VendorSignupComponent {
  formData:FormGroup

  constructor(private _vendorService:VendorService, private _router:Router) {
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
      this._vendorService.vendorRegister(this.formData.value).subscribe((res:ApiRes) => {
       const email = this.formData.value.Email;
        if (res.success == true) {
         localStorage.setItem("vendorEmail", email);
         this._router.navigate(['/vendor/sign-up/otp'])
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
      }
     );
     console.log(this.formData.value);

    } else {
      this.formData.markAllAsTouched();
    }
  }

}
