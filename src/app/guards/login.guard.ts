import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isEpiredToken } from '../shared/helpers/isExpiredJwt';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { lastValueFrom } from 'rxjs';

export const loginGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const role = route.parent?.routeConfig?.path!;
  const platform_id = inject(PLATFORM_ID);
  const _authService = inject(AuthService);

  if (isPlatformBrowser(platform_id)) {
    const token = localStorage.getItem(`${role}`);
    const refreshToken = localStorage.getItem(`${role}Refresh`);


    if (refreshToken && !isEpiredToken(refreshToken)) {
      if (isEpiredToken(token!)) {

        try {
          const res = await lastValueFrom(_authService.refreshToken(role, refreshToken));
          localStorage.setItem(`${role}`, res.data.accessToken);
          localStorage.setItem(`${role}Refresh`, res.data.refreshToken);
        } catch (error) {
          console.error("Failed to refresh token", error);
          return true;
        }
      }
      await router.navigate([`${role}/home`]);
      return false;
    }
  }

  return true;
};
