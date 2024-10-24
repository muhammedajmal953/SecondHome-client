import { inject, Injectable } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import * as UserActions from './user.actions';

@Injectable()
export class UserEffects {
  actions$  = inject(Actions);
  constructor(private userService: UserService) {}

  loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUserActions),
      mergeMap(() =>
        this.userService.getUser().pipe(
          map(apires => {
            if (apires.success) {
              return UserActions.loadUserSuccessActions({ user: apires.data });
            } else {
              return UserActions.loadUserFailureActions({ error: 'failed to loadUser' });
            }
          }),
          catchError(error =>
            of(UserActions.loadUserFailureActions({ error: error.message }))
          )
        )
      )
    )
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.logout),
      tap(() => {
        localStorage.removeItem('user');
        localStorage.removeItem('userRefresh');
        window.location.replace('/user');
      }),
      map(() => UserActions.logoutSuccess())
    )
  );
}
