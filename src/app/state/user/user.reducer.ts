import { createReducer, on } from "@ngrx/store";

import * as UserActions from './user.actions'



let intialState = {};

export const userReducer = createReducer(
  intialState,

  on(UserActions.loadUserSuccessActions, (state, action) => {
    return {
      ...state,
      user: action.user
    }
  }),
  on(UserActions.deleteUserActions, (state, action) => {
    return {
      ...state,
      user:null
    }
  }),
)

