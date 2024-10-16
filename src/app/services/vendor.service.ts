import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { ApiRes } from '../models/IApiRes';

@Injectable({
  providedIn: 'root'
})
export class VendorService {


  constructor(private http: HttpClient) { }

  api:string = 'http://localhost:5000/vendor'

  vendorRegister(vendor: any): Observable<ApiRes> {
    return this.http.post<ApiRes>(`${this.api}/sign-up`, vendor)
  }

  verifyVendor(email: string, otp: string): Observable<ApiRes>{
    return this.http.post<ApiRes>(`${this.api}/verify-otp`, {email, otp})
  }
  vendorLogin(vendor: any): Observable<ApiRes> {
    return this.http.post<ApiRes>(`${this.api}/login`, vendor)
  }

  googleAuthVendor(PROVIDER_ID: any) {
    return this.http.post<ApiRes>(`${this.api}/google-login`, {PROVIDER_ID})
  }

  vendorForgotPassword(email: string): Observable<ApiRes> {
    return this.http.post<ApiRes>(`${this.api}/forgot-password`, {email})
  }

  vendorChangePassword(email: string, password: string): Observable<ApiRes> {
    return this.http.post<ApiRes>(`${this.api}/change-password`, {email, password})
  }
  vendorKYC(file: any) {
    return this.http.put<ApiRes>(`${this.api}/kycUpload`, file)
  }


  vendorDetails(): Observable<ApiRes> {
    return this.http.get<ApiRes>(`${this.api}/vendorDetails`).pipe(
      catchError((error) => {
        console.error(`Error fetching vendor details:`, error);
        return throwError(() => new Error(`Failed to fetch vendor details`));
      })
    );
  }

  vendorEditProfile(data: any): Observable<ApiRes> {
    return this.http.put<ApiRes>(`${this.api}/edit-profile`, data)
  }

  changePassword(data:any): Observable<ApiRes>{
    return this.http.put<ApiRes>(`${this.api}/changePassword`,data)
  }

}
