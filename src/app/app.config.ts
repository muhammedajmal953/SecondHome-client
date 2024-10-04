import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { GoogleLoginProvider, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { userReducer } from './state/user/user.reducer';
import { jwtTokenInterceptor } from './interceptor/jwt-token.interceptor';
import { UserEffects } from './state/user/user.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withFetch(),
      withInterceptors([jwtTokenInterceptor])
    ),
    {
        provide: 'SocialAuthServiceConfig',
        useValue: {
            autoLogin: false,
            providers: [
                {
                    id: GoogleLoginProvider.PROVIDER_ID,
                    provider: new GoogleLoginProvider('735828254615-gm1n98614hshvghq10ljt42nep2k4m7m.apps.googleusercontent.com'),
                },
            ],
            onError: (err) => {
                console.error(err);
            }
        } as SocialAuthServiceConfig,
    }, provideAnimationsAsync(),
    provideStore(),
    provideEffects(),
]
};
