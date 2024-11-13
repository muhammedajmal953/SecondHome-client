
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-booking-notification',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './booking-notification.component.html',
  styleUrl: './booking-notification.component.css'
})
export class BookingNotificationComponent {
  @Input() title: string | undefined;
  @Input() body: string | undefined;
  @Input() showNotification: boolean | undefined;
  @Input() pic: string | undefined;

  @Output() changeShow = new EventEmitter()

  closeNotification() {
    this.showNotification = false

    this.changeShow.emit()
  }
}
