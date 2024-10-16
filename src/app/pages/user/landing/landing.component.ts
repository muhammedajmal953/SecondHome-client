import { Component } from '@angular/core';
import { HostelCardComponent } from "../../../components/hostel-card/hostel-card.component";
import { HostelService } from '../../../services/hostel.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    HostelCardComponent,
    NgFor
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent{
  title: string = 'Welcome to Our App';
  description: string = 'Experience the power of our innovative solution.';
  primaryButtonText: string = 'Get Started';
  primaryButtonLink: string = '#';
  secondaryButtonText: string = 'Learn More';
  secondaryButtonLink: string = '#';
  appName: string = 'Your App Name';
  hostels$: any


  constructor(private _hostelService:HostelService) {
    this._hostelService.getAllHostel().subscribe({
      next: (res) => {
        this.hostels$=res.data
          console.log(this.hostels$);

      }
    })
  }


}
