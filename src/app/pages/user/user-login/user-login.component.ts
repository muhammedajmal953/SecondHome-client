import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { GoogleSigninButtonModule, SocialAuthService } from '@abacritt/angularx-social-login';
import { UserService } from '../../../services/user.service';
import Swal from 'sweetalert2';
import { LoginUser } from '../../../models/IUsers';
import { HeaderNameComponent } from "../../../components/header-name/header-name.component";
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [HeaderNameComponent,
    ReactiveFormsModule,
    CommonModule,
    GoogleSigninButtonModule,
    RouterModule
  ],
  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.css'
})
export class UserLoginComponent implements OnInit,OnDestroy{
  formdata
  destroy$=new Subject<void>()

  constructor( private _userServices:UserService,private _authservice:SocialAuthService,private _router:Router) {
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
      this._userServices.loginWithGoogle(user.idToken).subscribe((res)=>{
        if(!res.success){
          Swal.fire({
            position: 'top',
            icon: 'error',
            title: 'Login failed',
            text: res.message,
            showConfirmButton: false,
            timer: 1500,
            toast: true,
          })
        } else {
          localStorage.setItem('user', res.data.token)
          localStorage.setItem('userRefresh', res.data.refreshToken)

          Swal.fire({
            position: 'top',
            icon: 'success',
            title: 'Login success',
            text: res.message,
            showConfirmButton: false,
            timer: 1500,
            toast: true,
          })

          this._router.navigate(['/user/home'])
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

      this._userServices.userLogin(data).pipe(takeUntil(this.destroy$)).subscribe((res)=>{
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
          localStorage.setItem('user', res.data.token)
          localStorage.setItem('userRefresh', res.data.refreshToken)
          this._router.navigate(['/user/home'])
        }
      },
        (error) => {
          console.log(error);
          Swal.fire({
            position: 'top',
            icon: 'error',
            title: 'Login failed',
            text: error.error.message,
            showConfirmButton: false,
            timer: 1500,
            toast: true,
          })
        }
      )
    } else{
      this.formdata.markAllAsTouched();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

}
