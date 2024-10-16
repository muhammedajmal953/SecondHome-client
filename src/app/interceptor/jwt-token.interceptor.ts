import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isEpiredToken } from '../shared/helpers/isExpiredJwt';
import { AuthService } from '../services/auth.service';

export const jwtTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const _authService = inject(AuthService);
  const platform_id = inject(PLATFORM_ID);
  let token: string | null = null;
  let refreshToken: string | null = null;
  let role: string = '';

  if (isPlatformBrowser(platform_id)) {
    const segments = req.url.split('/');
    role = segments[3];

    if (role !== 'admin' && role !== 'vendor') {
      role = 'user';
    }

    console.log(role);

    // Skip login and signup routes from being intercepted
    if (req.url.includes('login') || req.url.includes('signup')) {
      return next(req);
    }

    token = localStorage.getItem(`${role}`);
    refreshToken = localStorage.getItem(`${role}Refresh`);
  }

  // Proceed without modifying if no token is found
  if (!token) {
    return next(req);
  }

  //check is token expired
  if (isEpiredToken(token)) {
    console.warn('Access Token expired .Trying to refresh');

    if (refreshToken) {
      let newToken: string = '';
      let newRefreshToken: string = '';
      _authService.refreshToken(role, refreshToken).subscribe({
        next: (res) => {
          if (res.success) {
            newToken = res.data.accessToken;
            newRefreshToken = res.data.refreshToken;
          }
        },
      });
      if (newToken && newRefreshToken) {
        localStorage.setItem(`${role}`, newToken);
        localStorage.setItem(`${role}Refresh`, newRefreshToken);

        const modifiedReq = req.clone({
          headers: req.headers.set('Authorization', 'Bearer ' + newToken),
        });

        return next(modifiedReq);
      }
    } else {
      console.warn('No refresh token available, redirecting to login.');
      void router.navigate(['/login']);
      return next(req);
    }
  }

  const modifiedReq = req.clone({
    headers: req.headers.set('Authorization', 'Bearer ' + token),
  });

  return next(modifiedReq);
};
