import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isEpiredToken } from '../shared/helpers/isExpiredJwt';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../services/auth.service';


export const loginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const role = route.parent?.routeConfig?.path!
  console.warn(`the role is : ${role} login guard`);
  let token
  let refreshToken
  const platform_id = inject(PLATFORM_ID)
  const _authService=inject(AuthService)

  if (isPlatformBrowser(platform_id)) {
    token = localStorage.getItem(`${role}`)!
    refreshToken=localStorage.getItem(`${role}Refresh`)
  }


  if (!refreshToken || isEpiredToken(refreshToken)) {
    return true 
  }

  if (isEpiredToken(token!)) {
    _authService.refreshToken(role, refreshToken).subscribe({
      next: (res) => {
        localStorage.setItem(`${role}`,res.data.accessToken)
        localStorage.setItem(`${role}Refresh`,res.data.refreshToken)
      }
    })
  }
    void router.navigate([`${role}/home`])
    return false
};
