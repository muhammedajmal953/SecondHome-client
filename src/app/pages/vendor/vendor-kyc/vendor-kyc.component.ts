import { Component } from '@angular/core';
import { HeaderNameComponent } from '../../../components/header-name/header-name.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { log } from 'node:console';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vendor-kyc',
  standalone: true,
  imports: [
    HeaderNameComponent,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './vendor-kyc.component.html',
  styleUrl: './vendor-kyc.component.css',
})
export class VendorKycComponent {
  kycForm: FormGroup;
  constructor() {
    this.kycForm = new FormGroup({
      license: new FormControl(null, [Validators.required,this.mimeType]),
    });
  }
  onFileSelect($event: any) {
    let file = $event.target?.files[0];

    if (file) {
      this.kycForm.patchValue({ licence: file })
      this.kycForm.get('license')?.updateValueAndValidity();
    }
  }



  onSubmit() {
    if (this.kycForm.valid) {
      console.log(this.kycForm.value);

    } else {
      console.log('Form is invalid');

    }
  }


  mimeType(control: FormControl):ValidationErrors|null {
    if (control.value && typeof control.value === 'object') {
      const file = control.value as File;
      const validMimes = ['image/jpeg', 'image/png', 'application/pdf']
      if (validMimes.includes(file.type)) {
        return {mimeType:'Invalid file Type'}
      }

    }
    return null
  }
}
