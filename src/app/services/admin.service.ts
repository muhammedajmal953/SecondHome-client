import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry } from 'rxjs';
import { ApiRes } from '../models/IApiRes';
import { environments } from '../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private _http: HttpClient) {}

  api: string = environments.api;

  adminLogin(data: any): Observable<ApiRes> {
    return this._http.post<ApiRes>(`${this.api}/admin/login`, { data });
  }

  getAllUsers(
    page: number,
    limit: number,
    searchQuery: string
  ): Observable<ApiRes> {
    return this._http.get<ApiRes>(
      `${this.api}/admin/getAllUsers/${page}/${limit}?searchQuery=${searchQuery}`
    );
  }
  blockUser(token: string): Observable<ApiRes> {
    return this._http.put<ApiRes>(`${this.api}/admin/blockUser`, { token });
  }
  unBlockUser(token: string): Observable<ApiRes> {
    return this._http.put<ApiRes>(`${this.api}/admin/unBlockUser`, { token });
  }

  getAllVendors(
    page: number,
    limit: number,
    searchQuery: string
  ): Observable<ApiRes> {
    return this._http.get<ApiRes>(
      `${this.api}/admin/getAllVendors/${page}/${limit}?searchQuery=${searchQuery}`
    );
  }

  verifyVendor(id: string): Observable<ApiRes> {
    return this._http.put<ApiRes>(`${this.api}/admin/verifyVendor`, { id });
  }

  getAllHostel(page: number, searchQuery: string): Observable<ApiRes> {
    return this._http.get<ApiRes>(
      `${this.api}/admin/getAllHostel/${page}?searchQuery=${searchQuery}`
    );
  }

  blockHostel(id: string): Observable<ApiRes> {
    return this._http.put<ApiRes>(`${this.api}/admin/blockHostel`, { id });
  }
  unBlockHostel(id: string): Observable<ApiRes> {
    return this._http.put<ApiRes>(`${this.api}/admin/unBlockHostel`, { id });
  }

  getAllBookings(page: number): Observable<ApiRes> {
    return this._http.get<ApiRes>(`${this.api}/admin/getAllBookings/${page}`);
  }

  getAllDatas(): Observable<ApiRes> {
    return this._http.get<ApiRes>(`${this.api}/admin/admin-dashboard`);
  }
}
