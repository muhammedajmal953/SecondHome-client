import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-otp-form',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './otp-form.component.html',
  styleUrl: './otp-form.component.css'
})
export class OtpFormComponent {
onFileSelect($event: Event) {
throw new Error('Method not implemented.');
}
  otpForm: FormGroup
  @Output() otpSubmitted = new EventEmitter();


  constructor(private userService: UserService,private router:Router) {
    this.otpForm = new FormGroup({
      otp1: new FormControl(''),
      otp2: new FormControl(''),
      otp3: new FormControl(''),
      otp4: new FormControl(''),
      otp5: new FormControl(''),
      otp6: new FormControl(''),
    })
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



  handleSubmit() {
    if (this.otpForm.valid) {
      const otp = Object.values(this.otpForm.value).join('') as string;
      this.otpSubmitted.emit(otp);
    }
  }


}
