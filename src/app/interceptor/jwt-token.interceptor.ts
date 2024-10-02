import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const jwtTokenInterceptor: HttpInterceptorFn = (req, next) => {
  let router = inject(Router)

  return next(req);
};
