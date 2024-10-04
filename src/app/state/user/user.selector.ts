import { createFeatureSelector, createSelector } from "@ngrx/store";
import { UserDoc } from "../../models/IUsers";

export interface UserState{
  user: UserDoc | null
  error:string|null
}

export const selectUserState = createFeatureSelector<UserState>('user')

export const selectUserDetails = createSelector(
  selectUserState,
  (state: UserState) => state.user
)
