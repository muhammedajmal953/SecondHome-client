import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isEpiredToken } from '../shared/helpers/isExpiredJwt';

export const jwtTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const platform_id = inject(PLATFORM_ID);
  let token: string | null = null;

  if (isPlatformBrowser(platform_id)) {
    const segments = req.url.split('/');
    let role = segments[3];

   if(role!=='admin' && role!=='vendor'){
      role='user'
    }

    console.log(role);


    // Skip login and signup routes from being intercepted
    if (req.url.includes('login') || req.url.includes('signup')) {
      return next(req);
    }

    token = localStorage.getItem(`${role}`);


  }

  // Proceed without modifying if no token is found
  if (!token) {
    return next(req);
  }

  // Check if the token is expired
  if (!isEpiredToken(token)) {
    const modifiedReq = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + token),
    });
    return next(modifiedReq);
  }

  // Handle token expiration
  console.warn('Token expired, redirecting to login.');
  void router.navigate(['/login']);
  return next(req);
};
