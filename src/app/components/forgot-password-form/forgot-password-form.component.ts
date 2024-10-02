import { CommonModule } from '@angular/common';
import { Component, Output ,EventEmitter} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-forgot-password-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './forgot-password-form.component.html',
  styleUrl: './forgot-password-form.component.css'
})
export class ForgotPasswordFormComponent {
  formdata: FormGroup;

  @Output() formSubmitted = new EventEmitter()

  constructor() {
    this.formdata = new FormGroup({
      Email:new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')]),
    });
  }

  handleSubmit() {
    if (this.formdata.valid) {
      this.formSubmitted.emit(this.formdata.value);
    } else {
      this.formdata.markAllAsTouched();
    }

  }

}
