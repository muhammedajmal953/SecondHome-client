import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environments } from '../environment/environment';
import { Observable } from 'rxjs';
import { ApiRes } from '../models/IApiRes';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  constructor(private _http: HttpClient) { }

  api:string=`${environments.api}`

  addToWishList(id:string):Observable<ApiRes> {
    return this._http.post<ApiRes>(`${this.api}/add-to-wishlist`,{id})
  }

  getAllWishList(page:number):Observable<ApiRes> {
    return this._http.get<ApiRes>(`${this.api}/get-wishlist/${page}`)
  }

  removeFromWishlist(id:string): Observable<ApiRes>{
    return this._http.put<ApiRes>(`${this.api}/remove-wishlist`,{id})
  }
}
