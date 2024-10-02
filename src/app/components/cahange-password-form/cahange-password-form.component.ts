import { Component, Output } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
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

  constructor(private userService: UserService,private router:Router) {
    this.formData = new FormGroup({
      Password:new FormControl('', [Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$')]),
      ConfirmPassword:new FormControl('', [Validators.required]),
    }, { validators: this.passwordsMatchValidator }
    );
  }


  passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('Password')?.value;
    const confirmPassword = control.get('ConfirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }


  handleSubmit() {
    if (this.formData.valid) {
      const password = this.formData.get('Password')?.value as string;
      this.formSubmitted.emit(password);
    } else {
      this.formData.markAllAsTouched();
    }
  }

}

