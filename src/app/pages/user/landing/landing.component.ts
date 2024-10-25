import { Component } from '@angular/core';
import { HostelCardComponent } from '../../../components/hostel-card/hostel-card.component';
import { HostelService } from '../../../services/hostel.service';
import { NgFor } from '@angular/common';
import { Router } from '@angular/router';
import { error } from 'console';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [HostelCardComponent, NgFor],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
})
export class LandingComponent {
  title: string = 'Welcome to Our App';
  description: string = 'Experience the power of our innovative solution.';
  primaryButtonText: string = 'Get Started';
  primaryButtonLink: string = '#';
  secondaryButtonText: string = 'Learn More';
  secondaryButtonLink: string = '#';
  appName: string = 'Your App Name';
  hostels$: any;

  constructor(private _hostelService: HostelService, private _router: Router) {
    this._hostelService.getAllHostel(1, '').subscribe({
      next: (res) => {
        this.hostels$ = res.data;
      }, error: (error) => {
        Swal.fire({
          position: 'top',
          icon: 'error',
          text: error.error.message,
          showConfirmButton: false,
          timer: 1500,
          toast: true,
        });
      },
      complete: () => {},
    });
  }

  toHostels() {
    this._router.navigate(['/user/home/hostels']);
  }
}
