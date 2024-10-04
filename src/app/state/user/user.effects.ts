import { Injectable } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, switchMap } from 'rxjs';
import {
  loadUserActions,
  loadUserFailureActions,
  loadUserSuccessActions,
} from './user.actions';
import { ApiRes } from '../../models/IApiRes';

@Injectable()
export class UserEffects {
  constructor(private actions$: Actions, private userService: UserService) {
    console.log(this.actions$);

  }
  loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUserActions),
      mergeMap(() =>
        this.userService.getUser().pipe(
          map((apires: ApiRes) => {
            if (apires.success && apires.data != null) {
              return loadUserSuccessActions({ user: apires.data });
            } else {
              return loadUserFailureActions({ error: apires.message });
            }
          })
        )
      )
    )
  );
}
