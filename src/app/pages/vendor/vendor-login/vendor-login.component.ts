import { Component, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { GoogleSigninButtonModule, SocialAuthService } from '@abacritt/angularx-social-login';
import { Router, RouterLink } from '@angular/router';
import { LoginUser } from '../../../models/IUsers';
import { VendorService } from '../../../services/vendor.service';
import { CommonModule } from '@angular/common';
import { HeaderNameComponent } from "../../../components/header-name/header-name.component";
import { Subject, takeUntil } from 'rxjs';
import { unsubscribe } from 'diagnostics_channel';

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
export class VendorLoginComponent implements OnDestroy{
  formdata
  destroy$=new Subject<void>()

  constructor(private _vendorServices:VendorService,private _authservice:SocialAuthService,private _router:Router) {
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
    this._authservice.authState.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      console.log(user.idToken);

      this._vendorServices.googleAuthVendor(user.idToken).subscribe((res)=>{
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
          localStorage.setItem('vendor', res.data.token)
          localStorage.setItem('vendorRefresh', res.data.refreshToken)
          Swal.fire({
            position: 'top',
            icon: 'success',
            title: 'Login success',
            text: res.message,
            showConfirmButton: false,
            timer: 1500,
            toast: true,
          })

          this._router.navigate(['/vendor/home'])
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

      this._vendorServices.vendorLogin(data).subscribe((res)=>{
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
          localStorage.setItem('vendor', res.data.token)
          localStorage.setItem('vendorRefresh', res.data.refreshToken)
          this._router.navigate(['/vendor/home'])
        }
      }, (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Login failed',
          text: error.error.message,
          showConfirmButton: false,
          timer: 1500,
          toast: true,
        })
      })
    } else{
      this.formdata.markAllAsTouched();
    }
  }

 ngOnDestroy(): void {
   this.destroy$.next()
   this.destroy$.complete()
 }
}
