import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiRes } from '../models/IApiRes';
import { LoginUser, RegisterUser } from '../models/IUsers';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  api: string = 'http://localhost:5000'
  constructor (private http: HttpClient) { }


  userRegister(user: RegisterUser){
    return this.http.post<ApiRes>(`${this.api}/sign-up`, user)
  }
  userLogin(user: LoginUser){
    return this.http.post<ApiRes>(`${this.api}/login`, user)
  }

  verifyUser(email: string, otp: string): Observable<ApiRes>{
    return this.http.post<ApiRes>(`${this.api}/verify-otp`, {email, otp})
  }

  loginWithGoogle(PROVIDER_ID: any) {
    console.log(PROVIDER_ID);

    return this.http.post<ApiRes>(`${this.api}/google-login`, {PROVIDER_ID})
  }

  forgotPassword(email: string): Observable<ApiRes>{
    return this.http.post<ApiRes>(`${this.api}/forgot-password`, {email})
  }

  userChangePassword(email: string, password: string): Observable<ApiRes>{
    console.log('service called');

    return this.http.post<ApiRes>(`${this.api}/change-password`, {email, password})
  }
}
