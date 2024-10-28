import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { HostelService } from '../../../services/hostel.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-address',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './add-address.component.html',
  styleUrl: './add-address.component.css',
})
export class AddAddressComponent {
  onSubmit() {
    try {
      if (this.addressRateForm.valid) {
        let formdata = new FormData();

        Object.entries(this.addressRateForm.value).forEach(([key, value]) => {
          if (key === 'photos') {
            (value as File[]).forEach((file: File) => {
              formdata.append('photos', file);
            });
          } else if (key === 'rates') {
            let arr: { [key: string]: any }[] = [];
            Object.entries(value as { [key: string]:{price:number,quantity:number} }).forEach(
              ([item, details]) => {
                arr.push({
                  type: item,
                  price: details.price,
                  quantity:details.quantity
                });
              }
            );
            formdata.append('rates', JSON.stringify(arr));
          } else {
            formdata.append(key, value as any);
          }
        });

        formdata.append('name', this.hostelForm1.name);
        formdata.append('advance', this.hostelForm1.advance);

        formdata.append('phone', this.hostelForm1.phone);
        formdata.append('email', this.hostelForm1.email);
        formdata.append('category', this.hostelForm1.category);
        formdata.append('policies', this.hostelForm1.policies);
        formdata.append('facilities', this.hostelForm1.facilities);
        formdata.append('nearByPlaces', this.hostelForm1.nearbyPlaces);
        this._hostelService.addHostel(formdata).subscribe({
          next: (res) => {
            if (res.success) {
              console.log(res.message);
              Swal.fire({
                icon: 'success',
                text: res.message,
              });
              localStorage.removeItem('hostelForm1');
              this._router.navigate(['/vendor/home']);
            } else {
              Swal.fire({
                icon: 'error',
                text: res.message,
              });
            }
          },
          error: (error) => {
            Swal.fire({
              position: 'top',
              icon: 'error',
              text: error.error.message || 'Something went wrong',
              showConfirmButton: false,
              timer: 1500,
              toast: true,
            });
          },
        });
      }
      this.addressRateForm.markAllAsTouched();
    } catch (error: any) {
      console.log(error);
      Swal.fire({
        icon: 'error',
        text: error?.error?.message,
      });
    }
  }
  hostelForm1;
  addressRateForm: FormGroup;
  bedTypes: string[] = [];

  constructor(
    private _fb: FormBuilder,
    private _hostelService: HostelService,
    private _router: Router
  ) {
    const bedTypeGroup: { [key: string]: FormGroup } = {};
    const hostelFormData = localStorage.getItem('hostelForm1');
    if (hostelFormData) {
      this.hostelForm1 = JSON.parse(hostelFormData); // Parse string into object
      this.bedTypes = this.hostelForm1.selectedBedTypes;
      console.log(this.hostelForm1);
    } else {
      console.log('No hostelForm1 found in localStorage');
    }

    this.bedTypes.forEach((item) => {
      bedTypeGroup[item] = this._fb.group({
        price: ['', [Validators.required, Validators.min(1)]],
        quantity: ['', [Validators.required, Validators.min(1)]],
      });
    });

    this.addressRateForm = this._fb.group({
      city: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]{2,}$')]],
      street: ['', Validators.required],
      state: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      district: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      pincode: [
        '',
        [Validators.required, Validators.pattern('^[1-9][0-9]{5}$')],
      ],
      foodRate: [
        '',
        [Validators.required, Validators.pattern('^[1-9][0-9]*$')],
      ],
      rates: this._fb.group(bedTypeGroup),
      photos: ['', [Validators.required, this.mimeTypeValidator]],
      latitude:['',[Validators.required]],
      longtitude:['',[Validators.required]]
    });
  }

  onFileSelect($event: Event) {
    const target = $event.target as HTMLInputElement;
    const files = target.files;

    if (files) {
      this.addressRateForm.patchValue({
        photos: Array.from(files),
      });
    }
  }
  mimeTypeValidator(control: FormControl): ValidationErrors | null {
    if (control.value) {
      const files = control.value;

      for (const file of files) {
        const validMimes = [
          'image/jpeg',
          'image/png',
          'image/jpg',
          'image/webp',
        ];
        if (!validMimes.includes(file.type)) {
          return { mimeType: true };
        }
      }
      if (files.length > 5) {
        return { exceedLimit: true };
      }
    }
    return null;
  }

  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.addressRateForm.patchValue(
            {latitude:position.coords.latitude})
          this.addressRateForm.patchValue(
            {longtitude:position.coords.longitude})
        }, error => {
          console.error('Geolocation error:',error)
        }
      );
    }
  }
}
