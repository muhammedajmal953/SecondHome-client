import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, ObservedValueOf, throwError } from 'rxjs';
import { ApiRes } from '../models/IApiRes';
import { environments } from '../environment/environment';
import { Hostels } from '../models/IHostel';

@Injectable({
  providedIn: 'root'
})
export class VendorService {


  constructor(private _http: HttpClient) { }

  api:string = `${environments.api}/vendor`

  vendorRegister(vendor: any): Observable<ApiRes> {
    return this._http.post<ApiRes>(`${this.api}/sign-up`, vendor)
  }

  verifyVendor(email: string, otp: string): Observable<ApiRes>{
    return this._http.post<ApiRes>(`${this.api}/verify-otp`, {email, otp})
  }
  vendorLogin(vendor: any): Observable<ApiRes> {
    return this._http.post<ApiRes>(`${this.api}/login`, vendor)
  }

  googleAuthVendor(PROVIDER_ID: any,fcmToken:string|null) {
    return this._http.post<ApiRes>(`${this.api}/google-login`, {PROVIDER_ID,fcmToken})
  }

  vendorForgotPassword(email: string): Observable<ApiRes> {
    return this._http.post<ApiRes>(`${this.api}/forgot-password`, {email})
  }

  vendorChangePassword(email: string, password: string): Observable<ApiRes> {
    return this._http.post<ApiRes>(`${this.api}/change-password`, {email, password})
  }
  vendorKYC(file: any) {
    return this._http.put<ApiRes>(`${this.api}/kycUpload`, file)
  }


  vendorDetails(): Observable<ApiRes> {
    return this._http.get<ApiRes>(`${this.api}/vendorDetails`).pipe(
      catchError((error) => {
        console.error(`Error fetching vendor details:`, error);
        return throwError(() => new Error(`Failed to fetch vendor details`));
      })
    );
  }

  vendorEditProfile(data: any): Observable<ApiRes> {
    return this._http.put<ApiRes>(`${this.api}/edit-profile`, data)
  }

  changePassword(data:any): Observable<ApiRes>{
    return this._http.put<ApiRes>(`${this.api}/changePassword`,data)
  }

  resendOtp(email: string): Observable<ApiRes>{
    return this._http.post<ApiRes>(`${this.api}/resend-otp`,{email})
  }

  getAllHostels(page: number, searchQuery: string): Observable<ApiRes>{
    return this._http.get<ApiRes>(`${this.api}/getAllHostels/${page}?searchQuery=${searchQuery}`)
  }

  editHostel(formData: FormData, id: string): Observable<ApiRes>{
    return this._http.put<ApiRes>(`${this.api}/editHostel/${id}`,formData)
  }

  vendorBookings(page:number):Observable<ApiRes> {
    return this._http.get<ApiRes>(`${this.api}/get-bookings/${page}`)
  }

  cancelConform(id: string):Observable<ApiRes> {
    return this._http.put<ApiRes>(`${this.api}/confirm-cancel?id=${id}`,{})
  }

  getWalletBalance() {
    return this._http.get<ApiRes>(`${this.api}/wallet-balance`)
  }

  getBookingDetails(id:string) {
    return this._http.get<ApiRes>(`${this.api}/bookingDetails/${id}`)
  }


}
