import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '../../guards/auth.guard';
import { UserLoginComponent } from './user-login/user-login.component';
import { loginGuard } from '../../guards/login.guard';
import { UserHomeComponent } from './user-home/user-home.component';
import { UserSignUpComponent } from './user-sign-up/user-sign-up.component';
import { UserSignOtpComponent } from './user-sign-otp/user-sign-otp.component';
import { UserSignForgotPassWordComponent } from './user-sign-forgot-pass-word/user-sign-forgot-pass-word.component';
import { UserSignForgotChangePassWordComponent } from './user-sign-forgot-change-pass-word/user-sign-forgot-change-pass-word.component';
import { ReactiveFormsModule } from '@angular/forms';


const routes: Routes = [
  {
    path: '',
    canActivate:[loginGuard],
    component: UserLoginComponent,
  },
  {
    path: 'sign-up',
    canActivate:[loginGuard],
    children: [
      {
        path: '',
        component: UserSignUpComponent,
      },
      {
        path: 'otp',
        component:UserSignOtpComponent
      },
    ],
  },
  {
    path: 'home',
    canActivate:[authGuard],
    component: UserHomeComponent,
  },
  {
    path: 'forgot-password',
    canActivate:[loginGuard],
    component: UserSignForgotPassWordComponent,
  },
  {
    path: 'forgot-password/otp',
    canActivate: [loginGuard],
    component: UserSignOtpComponent
  },
  {
    path: 'forgot-password/change-password',
    canActivate:[loginGuard],
    component: UserSignForgotChangePassWordComponent,
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class UserModule { }
