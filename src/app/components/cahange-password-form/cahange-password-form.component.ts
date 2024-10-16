import { Component, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cahange-password-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './cahange-password-form.component.html',
  styleUrl: './cahange-password-form.component.css'
})
export class CahangePasswordFormComponent {
  formData: FormGroup;
  @Output() formSubmitted = new EventEmitter();

  constructor() {
    this.formData = new FormGroup({
      oldPassword: new FormControl('', [
        Validators.required,
        Validators.pattern('^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$')
      ]),
      newPassword: new FormControl('', [
        Validators.required,
        Validators.pattern('^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$')
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
    }, { validators: this.passwordsMatchValidator });
  }

  passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      return { passwordsMismatch: true };
    }

    return null;
  }

  handleSubmit() {
    if (this.formData.valid) {
      this.formSubmitted.emit(this.formData.value);
    } else {
      this.formData.markAllAsTouched();
    }
  }

}

