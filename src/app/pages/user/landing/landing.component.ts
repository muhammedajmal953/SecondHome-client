import { Component } from '@angular/core';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  title: string = 'Welcome to Our App';
  description: string = 'Experience the power of our innovative solution.';
  primaryButtonText: string = 'Get Started';
  primaryButtonLink: string = '#';
  secondaryButtonText: string = 'Learn More';
  secondaryButtonLink: string = '#';
  appName: string = 'Your App Name';
}
