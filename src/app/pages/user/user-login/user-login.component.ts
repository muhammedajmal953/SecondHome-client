import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import {
  GoogleSigninButtonModule,
  SocialAuthService,
} from '@abacritt/angularx-social-login';
import { UserService } from '../../../services/user.service';
import Swal from 'sweetalert2';
import { LoginUser } from '../../../models/IUsers';
import { HeaderNameComponent } from '../../../components/header-name/header-name.component';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { patters } from '../../../shared/constants/regexConstants';
import { FcmService } from '../../../services/fcm.service';
import { error } from 'console';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [
    HeaderNameComponent,
    ReactiveFormsModule,
    CommonModule,
    GoogleSigninButtonModule,
    RouterModule,
  ],
  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.css',
})
export class UserLoginComponent implements OnInit, OnDestroy {
  formdata;
  destroy$ = new Subject<void>();
  fcmToken!: string | null

  constructor(
    private _userServices: UserService,
    private _authservice: SocialAuthService,
    private _router: Router,
    private _fcmService:FcmService
  ) {
    this.formdata = new FormGroup({
      Email: new FormControl<string | null>('', [
        Validators.required,
        Validators.pattern(patters.EMAIL),
      ]),
      Password: new FormControl<string | null>('', [
        Validators.required,
        Validators.pattern(patters.PASSWORD),
      ]),
    });
  }
  ngOnInit(): void {


    this._authservice.authState.pipe(takeUntil(this.destroy$)).subscribe(
      (user) => {
        this._fcmService.requestPermission().subscribe((token) => {
          if (token) {
            this.fcmToken = token;
            console.log('Fcm Token:', this.fcmToken);
          } else {
            console.log('No FCM token received.');
          }
        }, (error) => {
          console.error('Fcm vendor token',error);
        },()=>{}
        )
        this._userServices.loginWithGoogle(user.idToken,this.fcmToken).subscribe((res) => {
          if (!res.success) {
            Swal.fire({
              position: 'top',
              icon: 'error',
              title: 'Login failed',
              text: res.message,
              showConfirmButton: false,
              timer: 1500,
              toast: true,
            });
          } else {
            localStorage.setItem('user', res.data.token);
            localStorage.setItem('userRefresh', res.data.refreshToken);

            Swal.fire({
              position: 'top',
              icon: 'success',
              title: 'Login success',
              text: res.message,
              showConfirmButton: false,
              timer: 1500,
              toast: true,
            });

            this._router.navigate(['/user/home']);
          }
        });
      },
      (error) => {
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
  }

  onSubmit(): void {
    if (this.formdata.valid) {
      let data!: LoginUser
      this._fcmService.requestPermission().subscribe((token) => {
        if (token) {
          this.fcmToken = token;
          data = {
            Email: this.formdata.value.Email!,
            Password: this.formdata.value.Password!,
            fcmToken:this.fcmToken
          };
          console.log(data);

          this.loginUser(data)
        } else {
          console.log('No FCM token received.');
        }
      }, (error) => {
        console.error('Fcm permission denined',error);
      }, () => {

      }
      )


    } else {
      this.formdata.markAllAsTouched();
    }
  }

  loginUser(data:LoginUser) {
    this._userServices
    .userLogin(data)
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (res) => {
        if (!res.success) {
          Swal.fire({
            position: 'top',
            icon: 'error',
            title: 'Login failed',
            text: res.message,
            showConfirmButton: false,
            timer: 1500,
            toast: true,
          });
        } else {
          Swal.fire({
            position: 'top',
            icon: 'success',
            title: 'Login success',
            text: res.message,
            showConfirmButton: false,
            timer: 1500,
            toast: true,
          });

          localStorage.setItem('user', res.data.token);
          localStorage.setItem('userRefresh', res.data.refreshToken);
          this._router.navigate(['/user/home']);
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
        });
      }
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
