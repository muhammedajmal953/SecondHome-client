import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { VendorLoginComponent } from './vendor-login/vendor-login.component';
import { VendorSignupComponent } from './vendor-signup/vendor-signup.component';
import { VendorOtpComponent } from './vendor-otp/vendor-otp.component';
import { VendorHomeComponent } from './vendor-home/vendor-home.component';
import { VendorForgotPasswordComponent } from './vendor-forgot-password/vendor-forgot-password.component';
import { VendorChangePasswordComponent } from './vendor-change-password/vendor-change-password.component';
import { authGuard } from '../../guards/auth.guard';
import { loginGuard } from '../../guards/login.guard';
import { VendorKycComponent } from './vendor-kyc/vendor-kyc.component';


const routes: Routes = [
  {
    path: '',
    canActivate:[authGuard],
    component: VendorLoginComponent,
  },
  {
    path: 'sign-up',
    canActivate:[authGuard],
    children: [
      {
        path: '',
        component: VendorSignupComponent,
      },
      {
        path: 'otp',
        component:VendorOtpComponent
      },
      {
        path: 'kyc',
        component:VendorKycComponent
      }
    ],
  },
  {
    path: 'home',
    canActivate:[authGuard],
    component: VendorHomeComponent,
  },
  {
    path: 'forgot-password',
    canActivate:[loginGuard],
    component: VendorForgotPasswordComponent,
  },
  {
    path: 'forgot-password/change-password',
    canActivate:[loginGuard],
    component: VendorChangePasswordComponent,
  },
  {
    path: 'forgot-password/otp',
    canActivate: [loginGuard],
    component: VendorOtpComponent,
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(
      routes
    )
  ]
})
export class VendorModule { }
