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


const routes: Routes = [
  {
    path: '',
    component: AdminLoginComponent,
    canActivate:[loginGuard]
  },
  {
    path: 'home',
    component: AdminDashboardComponent,
    canActivate:[authGuard],
    children: [
      {
        path: 'users',
        component:UserManagementComponent
      },
      {
        path: 'vendors',
        component:VendorManagementComponent
      },
      {
        path: 'hostels',
        component:HostelManagementComponent
      },
    ]
  },
];


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class AdminModule { }
