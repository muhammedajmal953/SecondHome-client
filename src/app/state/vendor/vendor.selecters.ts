import { createFeatureSelector, createSelector } from "@ngrx/store";
import { VendorState } from "./vendor.reducer";

export const selectVendorState = createFeatureSelector<VendorState>('vendor')

export const selectVendor = createSelector(
  selectVendorState,
  (state:VendorState)=>state.vendor
)
export const selectVendorLoading = createSelector(
  selectVendorState,
  (state:VendorState)=>state.loading
)
export const selectVendorError = createSelector(
  selectVendorState,
  (state:VendorState)=>state.error
)
