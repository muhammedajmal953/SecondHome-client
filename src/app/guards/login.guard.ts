import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isEpiredToken } from '../shared/helpers/isExpiredJwt';
import { isPlatformBrowser } from '@angular/common';


export const loginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const role = route.parent?.routeConfig?.path!
  console.warn(`the role is : ${role} login guard`);
  let token
  const platform_id = inject(PLATFORM_ID)

  if (isPlatformBrowser(platform_id)) {
    token=localStorage.getItem(`${role}`)!
  }


  if (!token || isEpiredToken(token!)) {
    return true
  }
    void router.navigate([`${role}/home`])
    return false


};
