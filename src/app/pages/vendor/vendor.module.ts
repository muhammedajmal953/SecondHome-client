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
import { log } from 'console';
import { VendorHostelsComponent } from './vendor-hostels/vendor-hostels.component';
import { AddHostelComponent } from './add-hostel/add-hostel.component';
import { AddAddressComponent } from './add-address/add-address.component';
import { VendorProfileComponent } from './vendor-profile/vendor-profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { EditHostelComponent } from './edit-hostel/edit-hostel.component';
import { ChatBoxComponent } from './chat-box/chat-box.component';
import { BookingDetailsComponent } from './booking-details/booking-details.component';


const routes: Routes = [
  {
    path: '',
    canActivate:[loginGuard],
    component: VendorLoginComponent,
  },
  {
    path: 'sign-up',
    canActivate:[loginGuard],
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
    canActivate: [authGuard],
    component: VendorHomeComponent,
    children: [
      {
        path: '',
        component: VendorHostelsComponent
      },
      {
        path: 'add-hostel',
        component:AddHostelComponent
      },
      {
        path:'add-hostel2',
        component:AddAddressComponent
      },
      {
        path: 'profile',
        component:VendorProfileComponent
      },
      {
        path: 'edit-profile',
        component:EditProfileComponent
      },
      {
        path: 'change-password',
        component:ChangePasswordComponent
      },
      {
        path: 'edit-hostel',
        component:EditHostelComponent
      },
      {
        path: 'chat',
        component:ChatBoxComponent
      },
      {
        path: 'booking-details/:id',
        component:BookingDetailsComponent
      }
    ]
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
