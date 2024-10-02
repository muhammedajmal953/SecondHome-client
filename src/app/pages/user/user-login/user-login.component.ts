import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { GoogleSigninButtonModule, SocialAuthService } from '@abacritt/angularx-social-login';
import { UserService } from '../../../services/user.service';
import Swal from 'sweetalert2';
import { LoginUser } from '../../../models/IUsers';
import { HeaderNameComponent } from "../../../components/header-name/header-name.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [HeaderNameComponent,
    ReactiveFormsModule,
    CommonModule,
    GoogleSigninButtonModule,
    RouterLink
  ],
  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.css'
})
export class UserLoginComponent {
  formdata

  constructor( private userServices:UserService,private authservice:SocialAuthService,private router:Router) {
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
      console.log(user);
      this.userServices.loginWithGoogle(user.idToken).subscribe((res)=>{
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
          localStorage.setItem('/user', res.data)

          Swal.fire({
            position: 'top',
            icon: 'success',
            title: 'Login success',
            text: res.message,
            showConfirmButton: false,
            timer: 1500,
            toast: true,
          })

          this.router.navigate(['/user/home'])
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

      this.userServices.userLogin(data).subscribe((res)=>{
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
          localStorage.setItem('user',res.data)
          this.router.navigate(['/user/home'])
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


}
