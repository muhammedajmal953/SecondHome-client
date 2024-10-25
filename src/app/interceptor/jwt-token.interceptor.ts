import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isEpiredToken } from '../shared/helpers/isExpiredJwt';
import { AuthService } from '../services/auth.service';
import { BehaviorSubject, catchError, EMPTY, of, switchMap } from 'rxjs';



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


    console.log(`Role detected: ${role}`);

    if (req.url.includes('login') || req.url.includes('signup')|| req.url.includes('refresh-token')) {
      return next(req);
    }

    token = localStorage.getItem(`${role}`);
    refreshToken = localStorage.getItem(`${role}Refresh`);
  }


  if (!token) {
    return next(req);
  }

  if (isEpiredToken(token)) {
    console.warn('Access Token expired .Trying to refresh');
    localStorage.removeItem(`${role}`)

    if (!refreshToken || isEpiredToken(refreshToken)) {
      console.warn('Refresh token expired or not available, redirecting to login.');
      void router.navigate([`/${role}/login`]);
      return EMPTY;
    }
      _authService.refreshToken(role, refreshToken).pipe(
        switchMap((res) => {
          if (res.success) {
            const newToken = res.data.accessToken;
            const newRefreshToken = res.data.refreshToken;

            localStorage.setItem(`${role}`, newToken);
            localStorage.setItem(`${role}Refresh`, newRefreshToken);

            const modifiedReq = req.clone({
              headers: req.headers.set('Authorization', 'Bearer ' + newToken),
            });

            return next(modifiedReq);
          } else {

            console.warn('Token refresh failed, redirecting to login.');
            void router.navigate([`/${role}/login`]);
            return EMPTY
          }

        }),
        catchError((err) => {
          console.error('Error fetching,toekn', err)
          void router.navigate([`/${role}/login`])
          return EMPTY
        })
      );


  }
    const modifiedReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
    return next(modifiedReq);
};
