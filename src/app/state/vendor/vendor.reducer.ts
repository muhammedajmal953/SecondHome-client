import { createReducer, on } from "@ngrx/store"
import { UserDoc } from "../../models/IUsers"
import * as VendorActions from './vendor.actions'

export interface VendorState{
  vendor: UserDoc|null,
  loading: boolean
  error:any
}

let intialState:VendorState = {
  vendor: null,
  loading: false,
  error:null
}

export const VendorReducer = createReducer(
  intialState,

  on(VendorActions.loadVendor, state =>({
    ...state,
    loading:true
  })),
  on(VendorActions.loadVendorSuccess,(state, { vendor }) => ({

    ...state,
    vendor,
    loading: false,
    error: null

  })),
  on(VendorActions.loadVendorFailure, (state,{error}) => ({
    ...state,
    loading: false,
    error:null
  })),
  on(VendorActions.logoutSuccess, state => ({
    ...state,
    user:null
  }))
)
