import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiRes } from '../models/IApiRes';
import { environments } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class HostelService {

  api:string=environments.api

  constructor(private _http: HttpClient) { }

  addHostel(formData: any): Observable<ApiRes>{
    return this._http.post<ApiRes>(`${this.api}/vendor/addHostel`,formData)
  }

  getAllHostel(page:number,searchQuery:string): Observable<ApiRes>{
    return this._http.get<ApiRes>(`${this.api}/getAllHostel/${page}?searchQuery=${searchQuery}`)
  }

  getHostel(id: string) {
    return this._http.get<ApiRes>(`${this.api}/vendor/getHostel/${id}`)
  }

}
