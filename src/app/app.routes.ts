import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './pages/error/page-not-found/page-not-found.component';

export const routes: Routes = [
  {
    path: 'user',
    loadChildren: () => import('./pages/user/user.module').then(m => m.UserModule),
  },
  {
    path: 'vendor',
    loadChildren: () => import('./pages/vendor/vendor.module').then(m => m.VendorModule),
  },
  {
    path: 'admin',
    loadChildren: () => import('./pages/admin/admin.module').then(m => m.AdminModule),
  },
  {
    path: '**',
    redirectTo: 'user',
  }
];
