import { Component } from '@angular/core';
import { HeaderNameComponent } from '../../../components/header-name/header-name.component';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { error, log } from 'node:console';
import { CommonModule } from '@angular/common';
import { VendorService } from '../../../services/vendor.service';
import { ApiRes } from '../../../models/IApiRes';
import Swal from 'sweetalert2';
import { format } from 'node:path';
import { Router } from '@angular/router';

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
  constructor(private vendorService: VendorService,private fb:FormBuilder,private router:Router) {
    this.kycForm = this.fb.group({
      license: [null, [Validators.required,this.mimeType]]
    });
  }
  onFileSelect($event: any) {
    const target = $event.target as HTMLInputElement;
    const file = target.files?.[0];



    if (file) {

      this.kycForm.patchValue({
        license: file
  })
      this.kycForm.get('license')?.updateValueAndValidity()
    }
  }



  onSubmit() {
    if (this.kycForm.valid) {
      let formData = new FormData();
      let email = localStorage.getItem('vendorEmail')!;
      let file = this.kycForm.get('license')?.value;

      formData.append('license', file);
      formData.append('email', email);

      console.log(formData);
      this.vendorService.vendorKYC(formData).subscribe((res: ApiRes) => {
        if (res.success) {
          Swal.fire({
            position: 'top',
            icon: 'success',
            title: 'License uploaded successfully',
            showConfirmButton: false,
            timer: 1500,
            toast: true,
          })

          localStorage.removeItem('vendorEmail');
          this.router.navigate(['/vendor/home']);
        } else {
          console.log('no data arrived');

        }
      }, error => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error.message
        })

      })

    } else {
      console.log('Form is invalid');

    }
  }


  mimeType(control: FormControl):ValidationErrors|null {
    const file = control.value ;
    if (file && typeof file === 'object') {
      const validMimes = ['image/jpeg','image/png', 'application/pdf']
      if (!validMimes.includes(file.type)) {
        return {mimeType:true}
      }

    }
    return null
  }
}
