import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { loginGuard } from '../../guards/login.guard';
import { VendorManagementComponent } from './vendor-management/vendor-management.component';
import { authGuard } from '../../guards/auth.guard';
import { HostelManagementComponent } from './hostel-management/hostel-management.component';
import { BookingPaymentComponent } from './booking-payment/booking-payment.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLoginComponent,
    canActivate: [loginGuard],
  },
  {
    path: 'home',
    component: AdminDashboardComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'users',
        component: UserManagementComponent,
      },
      {
        path: 'vendors',
        component: VendorManagementComponent,
      },
      {
        path: 'hostels',
        component: HostelManagementComponent,
      },
      {
        path: 'bookings',
        component: BookingPaymentComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class AdminModule {}
