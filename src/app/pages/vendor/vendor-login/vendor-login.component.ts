import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { GoogleSigninButtonModule, SocialAuthService } from '@abacritt/angularx-social-login';
import { Router, RouterLink } from '@angular/router';
import { LoginUser } from '../../../models/IUsers';
import { VendorService } from '../../../services/vendor.service';
import { CommonModule } from '@angular/common';
import { HeaderNameComponent } from "../../../components/header-name/header-name.component";

@Component({
  selector: 'app-vendor-login',
  standalone: true,
  imports: [
    GoogleSigninButtonModule,
    ReactiveFormsModule,
    CommonModule,
    HeaderNameComponent,
    RouterLink
],
  templateUrl: './vendor-login.component.html',
  styleUrl: './vendor-login.component.css'
})
export class VendorLoginComponent {
  formdata

  constructor(private vendorServices:VendorService,private authservice:SocialAuthService,private router:Router) {
    this.formdata =new FormGroup({
      Email: new FormControl<string | null>("",
        [Validators.required,
          Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
        ]),
      Password: new FormControl<string|null>("", [
        Validators.required,
        Validators.pattern('^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$')
      ])
    })
  }


  ngOnInit(): void {
    this.authservice.authState.subscribe((user) => {
      console.log(user.idToken);

      this.vendorServices.googleAuthVendor(user.idToken).subscribe((res)=>{
        if(!res.success){
          Swal.fire({
            position: 'top',
            icon: 'error',
            title: res.message,
            text: res.message,
            showConfirmButton: false,
            timer: 1500,
            toast: true,
          })
        } else {
          localStorage.setItem('vendor', res.data)

          Swal.fire({
            position: 'top',
            icon: 'success',
            title: 'Login success',
            text: res.message,
            showConfirmButton: false,
            timer: 1500,
            toast: true,
          })

          this.router.navigate(['/vendor/home'])
        }


      })
    })
  }


  onSubmit(): void {
    if (this.formdata.valid) {
      let data: LoginUser = {
        Email: this.formdata.value.Email!,
        Password: this.formdata.value.Password!
      }

      this.vendorServices.vendorLogin(data).subscribe((res)=>{
        if (!res.success) {
          Swal.fire({
            position: 'top',
            icon: 'error',
            title: 'Login failed',
            text: res.message,
            showConfirmButton: false,
            timer: 1500,
            toast: true,
          })
          return 
        } else {
          Swal.fire({
            position: 'top',
            icon: 'success',
            title: 'Login success',
            text: res.message,
            showConfirmButton: false,
            timer: 1500,
            toast: true,
          })
          localStorage.setItem('vendor',res.data)
          this.router.navigate(['/vendor/home'])
        }
      })
    } else{
      this.formdata.markAllAsTouched();
    }
  }


}
