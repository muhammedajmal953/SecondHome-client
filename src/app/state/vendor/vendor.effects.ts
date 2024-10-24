import { inject, Injectable } from '@angular/core';
import * as VendorSelectors from '../user/user.selector';
import * as VendorActions from './vendor.actions';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { VendorService } from '../../services/vendor.service';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { error } from 'console';

@Injectable()
export class VendorEffects {
  private _actions$ = inject(Actions);

  constructor(private _vendorService: VendorService) {}

  loadVendor$ = createEffect(() =>
    this._actions$.pipe(
      ofType(VendorActions.loadVendor),
      mergeMap(() =>
        this._vendorService.vendorDetails().pipe(
          map((apires) => {
            if (apires.success) {
              return VendorActions.loadVendorSuccess({ vendor: apires.data });
            } else {
              return VendorActions.loadVendorFailure({
                error: 'Failed To Get Vendor',
              });
            }
          }),
          catchError((error) =>
            of(VendorActions.loadVendorFailure({ error: error.message }))
          )
        )
      )
    )
  );


  logout$ = createEffect(() =>
    this._actions$.pipe(
      ofType(VendorActions.logout),
      tap(() => {
        localStorage.removeItem('vendor'),
          localStorage.removeItem('vendorRefresh'),
          window.location.replace('/vendor')
      }),
      map(()=>VendorActions.logoutSuccess())
    )
  )
  
}
