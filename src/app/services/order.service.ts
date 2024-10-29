import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiRes } from '../models/IApiRes';
import { environments } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
 apiUrl:string=environments.api
  constructor(private _http: HttpClient) { }

  createOrder(orderData: any): Observable<ApiRes>{
    return this._http.post<ApiRes>(`${this.apiUrl}/confirm-order`,orderData)
  }

  saveBooking(bookingData: any): Observable<ApiRes> {
    return this._http.post<ApiRes>(`${this.apiUrl}/save-booking`, bookingData)
  }

}
