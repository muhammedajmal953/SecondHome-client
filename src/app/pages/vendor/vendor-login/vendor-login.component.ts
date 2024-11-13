import { Component, OnDestroy } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import Swal from 'sweetalert2';
import {
  GoogleSigninButtonModule,
  SocialAuthService,
} from '@abacritt/angularx-social-login';
import { Router, RouterLink } from '@angular/router';
import { LoginUser } from '../../../models/IUsers';
import { VendorService } from '../../../services/vendor.service';
import { CommonModule } from '@angular/common';
import { HeaderNameComponent } from '../../../components/header-name/header-name.component';
import { Subject, takeUntil } from 'rxjs';
import { patters } from '../../../shared/constants/regexConstants';
import { FcmService } from '../../../services/fcm.service';

@Component({
  selector: 'app-vendor-login',
  standalone: true,
  imports: [
    GoogleSigninButtonModule,
    ReactiveFormsModule,
    CommonModule,
    HeaderNameComponent,
    RouterLink,
  ],
  templateUrl: './vendor-login.component.html',
  styleUrl: './vendor-login.component.css',
})
export class VendorLoginComponent implements OnDestroy {
  formdata;
  destroy$ = new Subject<void>();
  fcmToken!:string|null

  constructor(
    private _vendorServices: VendorService,
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
    this._authservice.authState
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
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
        this._vendorServices.googleAuthVendor(user.idToken,this.fcmToken).subscribe((res) => {
          if (!res.success) {
            Swal.fire({
              position: 'top',
              icon: 'error',
              title: res.message,
              text: res.message,
              showConfirmButton: false,
              timer: 1500,
              toast: true,
            });
          } else {
            localStorage.setItem('vendor', res.data.token);
            localStorage.setItem('vendorRefresh', res.data.refreshToken);
            Swal.fire({
              position: 'top',
              icon: 'success',
              title: 'Login success',
              text: res.message,
              showConfirmButton: false,
              timer: 1500,
              toast: true,
            });

            this._router.navigate(['/vendor/home']);
          }
        });
      });
  }

  onSubmit(): void {
    if (this.formdata.valid) {
      let data: LoginUser = {
        Email: this.formdata.value.Email!,
        Password: this.formdata.value.Password!,
        fcmToken:this.fcmToken
      };

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
      console.log(data);

      this._vendorServices.vendorLogin(data).subscribe(
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
            return;
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
            localStorage.setItem('vendor', res.data.token);
            localStorage.setItem('vendorRefresh', res.data.refreshToken);
            this._router.navigate(['/vendor/home']);
          }
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Login failed',
            text: error.error.message,
            showConfirmButton: false,
            timer: 1500,
            toast: true,
          });
        }
      );
    } else {
      this.formdata.markAllAsTouched();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
