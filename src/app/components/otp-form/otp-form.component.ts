import { AfterContentInit, Component, EventEmitter, Inject, OnDestroy, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import { BehaviorSubject, interval, Subscription, takeWhile, timer } from 'rxjs';
import { time } from 'console';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-otp-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './otp-form.component.html',
  styleUrl: './otp-form.component.css'
})

export class OtpFormComponent implements OnInit,OnDestroy{
onFileSelect($event: Event) {
throw new Error('Method not implemented.');
}
  otpForm: FormGroup
  @Output() otpSubmitted = new EventEmitter();
  @Output() otpResend = new EventEmitter();

  timerLeft: number = 60
  showResend: boolean = false
  isBrowser!: boolean;
  private timerSubscription?: Subscription;

  constructor(private userService: UserService, private router: Router,@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser=isPlatformBrowser(platformId)
    this.otpForm = new FormGroup({
      otp1: new FormControl(''),
      otp2: new FormControl(''),
      otp3: new FormControl(''),
      otp4: new FormControl(''),
      otp5: new FormControl(''),
      otp6: new FormControl(''),
    })

  }
  ngOnInit(): void {
    if (this.isBrowser) {
      this.startTimer()
    }
  }

  onInput(event: any,currentIndex:number) {
    const input = event.target.value;

    if (input.length === 1 && currentIndex < 5) {
      const nextInput = document.getElementById(`otp${currentIndex + 2}`) as HTMLInputElement;
      if (nextInput) {
        (nextInput as HTMLInputElement).focus();
      }
    }

    if (event.inputType === 'deleteContentBackward' && currentIndex > 0) {
      const previousInput = document.getElementById(`otp${currentIndex}`) as HTMLInputElement;
      if (previousInput) {
        (previousInput as HTMLInputElement).focus();
      }
     }

  }

  startTimer() {
    this.timerLeft = 60;
    this.showResend=false

    // Clear any existing subscription
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }

    // Create new timer subscription
    this.timerSubscription = timer(0, 1000).subscribe(() => {
        if (this.timerLeft <= 0) {
          this.showResend = true;
          this.timerSubscription?.unsubscribe();
        } else {
          this.timerLeft--;
        }
      });
  }




  resendOtp() {
    this.startTimer()
    this.showResend = false

    this.otpResend.emit()
    Swal.fire({
      position: 'top',
      toast: true,
      showConfirmButton: false,
      title: 'otp sent to your email',
      timer: 1500,
      icon:'success'
    })
  }

  handleSubmit() {
    if (this.otpForm.valid) {
      const otp = Object.values(this.otpForm.value).join('') as string;
      this.otpSubmitted.emit(otp);
    }
  }


  ngOnDestroy(): void{
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe()
    }
  }

}
