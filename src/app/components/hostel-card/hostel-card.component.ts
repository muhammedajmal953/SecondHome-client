import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hostel-card',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './hostel-card.component.html',
  styleUrl: './hostel-card.component.css'
})
export class HostelCardComponent {
  @Input() buttonName:string='Book Now'
  @Input() hosteDetails: any
  @Output() triggerButton=new EventEmitter()

  stars: number[] = [1, 2, 3]

  handleClick(id:string,isActive:boolean) {
    this.triggerButton.emit({id,isActive})
  }
}
