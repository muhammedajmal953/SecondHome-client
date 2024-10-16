import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiRes } from '../models/IApiRes';

@Injectable({
  providedIn: 'root'
})
export class AdminService {


  constructor(private _http: HttpClient) { }

  adminLogin(data: any): Observable<ApiRes> {

    return this._http.post<ApiRes>('http://localhost:5000/admin/login', { data })
  }

  getAllUsers(page:number,limit:number): Observable<ApiRes> {
  return this._http.get<ApiRes>(`http://localhost:5000/admin/getAllUsers/${page}/${limit}`)
  }
  blockUser(token: string): Observable<ApiRes> {
    return this._http.put<ApiRes>('http://localhost:5000/admin/blockUser', { token })
  }
  unBlockUser(token: string): Observable<ApiRes> {
    return this._http.put<ApiRes>('http://localhost:5000/admin/unBlockUser', { token })
  }

  getAllVendors(page:number,limit:number):Observable<ApiRes>{
    return this._http.get<ApiRes>(`http://localhost:5000/admin/getAllVendors/${page}/${limit}`)
  }


  verifyVendor(id:string):Observable<ApiRes> {
    return this._http.put<ApiRes>('http://localhost:5000/admin/verifyVendor', {id})
  }
}
