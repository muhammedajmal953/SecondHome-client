import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vendor-hostels',
  standalone: true,
  imports: [],
  templateUrl: './vendor-hostels.component.html',
  styleUrl: './vendor-hostels.component.css'
})
export class VendorHostelsComponent {
  constructor(private _router:Router) {

  }
  addHostel() {
    this._router.navigate(['/vendor/home/add-hostel']);
  }
}
