import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { ApiRes } from '../models/IApiRes';

@Injectable({
  providedIn: 'root'
})
export class VendorService {


  constructor(private http: HttpClient) { }


  vendorRegister(vendor: any): Observable<ApiRes> {
    return this.http.post<ApiRes>('http://localhost:5000/vendor/sign-up', vendor)
  }

  verifyVendor(email: string, otp: string): Observable<ApiRes>{
    return this.http.post<ApiRes>(`http://localhost:5000/vendor/verify-otp`, {email, otp})
  }
  vendorLogin(vendor: any): Observable<ApiRes> {
    return this.http.post<ApiRes>('http://localhost:5000/vendor/login', vendor)
  }

  googleAuthVendor(PROVIDER_ID: any) {
    return this.http.post<ApiRes>('http://localhost:5000/vendor/google-login', {PROVIDER_ID})
  }

  vendorForgotPassword(email: string): Observable<ApiRes> {
    return this.http.post<ApiRes>('http://localhost:5000/vendor/forgot-password', {email})
  }

  vendorChangePassword(email: string, password: string): Observable<ApiRes> {
    return this.http.post<ApiRes>('http://localhost:5000/vendor/change-password', {email, password})
  }
  vendorKYC(file: any) {
    return this.http.put<ApiRes>('http://localhost:5000/vendor/kycUpload', file)
  }


  vendorDetails(): Observable<ApiRes> {
    return this.http.get<ApiRes>('http://localhost:5000/vendor/vendorDetails').pipe(
      catchError((error) => {
        console.error('Error fetching vendor details:', error);
        return throwError(() => new Error('Failed to fetch vendor details'));
      })
    );
  }
}
