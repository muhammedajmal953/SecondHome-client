import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiRes } from '../models/IApiRes';

@Injectable({
  providedIn: 'root'
})
export class HostelService {

  api:string='http://localhost:5000'

  constructor(private _http: HttpClient) { }

  addHostel(formData: any): Observable<ApiRes>{
    return this._http.post<ApiRes>(`${this.api}/vendor/addHostel`,formData)
  }

  getAllHostel(): Observable<ApiRes>{
    return this._http.get<ApiRes>(`${this.api}/getAllHostel`)
  }


}
