import { createAction, props } from "@ngrx/store";
import { UserDoc } from "../../models/IUsers";


export const loadVendor = createAction('[Vendor] loadVendor')

export const loadVendorSuccess = createAction(
  '[Vendor] load Vendor Success',
  props<{vendor:UserDoc}>()
)

export const loadVendorFailure = createAction(
  '[Vendor] load Vendor failure',
  props<{error:any}>()
)

export const logout = createAction('[Vendor] Logout');
export const logoutSuccess = createAction('[Vendor] Logout Success');
