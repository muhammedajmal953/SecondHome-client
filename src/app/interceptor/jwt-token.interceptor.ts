import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';

export const jwtTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  const patform_id = inject(PLATFORM_ID);
  let token:string|null = null;
  if (isPlatformBrowser(patform_id)) {
    let segmets = req.url.split('/');
  console.warn('asdf',segmets);
  let role = segmets[3];
  console.warn(`the role is : ${role}`);
   token = localStorage.getItem(`${role}`);
  }




  if (token) {
    const modifiedReq = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + token),
    });

    return next(modifiedReq);
  }
  return next(req);
};
