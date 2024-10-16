import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiRes } from '../models/IApiRes';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 api:string='http://localhost:5000'
  constructor(private _http: HttpClient) { }

  refreshToken(role: string, refreshToken: string): Observable<ApiRes>{
    return this._http.get<ApiRes>(`${this.api}/${role}/token`,{params:{refreshToken}})
  }
}
