import { createReducer, on } from '@ngrx/store';
import  {UserDoc}  from '../../models/IUsers'
import * as UserActions from './user.actions';



export interface UserState {
  user: UserDoc | null;
  loading: boolean;
  error: any;
}
let intialState: UserState = {
  user: null,
  loading: false,
  error:null
};

export const userReducer = createReducer(
  intialState,

  on(UserActions.loadUserActions, state => ({

      ...state,
      loading: true

  })),
  on(UserActions.loadUserSuccessActions, (state, { user }) => ({

      ...state,
      user,
      loading: false,
      error: null

  })),
  on(UserActions.loadUserFailureActions, (state, { error }) => ({

      ...state,
      loading: false,
      error: null

  })),
  on(UserActions.logoutSuccess, state => ({
    ...state,
    user: null
  }))

)

