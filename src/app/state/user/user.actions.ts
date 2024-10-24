import { createAction, props } from "@ngrx/store";
import { UserDoc } from "../../models/IUsers";


export const loadUserActions = createAction('[User] Load User')

export const loadUserSuccessActions = createAction(
  '[User] Load User Success',
  props<{ user: UserDoc }>()
)

export const loadUserFailureActions = createAction(
  '[User] Load User Failure',
  props<{ error: any }>()
)
export const logout = createAction('[User] Logout');
export const logoutSuccess = createAction('[User] Logout Success');


