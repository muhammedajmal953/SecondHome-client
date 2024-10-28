import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VendorService } from '../../../services/vendor.service';
import { HostelService } from '../../../services/hostel.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-hostel',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './edit-hostel.component.html',
  styleUrl: './edit-hostel.component.css',
})
export class EditHostelComponent implements OnInit {
  facilities: string[] = [];
  nearbyPlaces: string[] = [];
  categories: string[] = ['MEN', 'WOMEN', 'MIXED'];
  hostelForm: FormGroup;
  bedTypes:  { type: string; price: number,quantity:number }[] = [];
  photoUrls: string[] = [];
  existingPhotos: string[] = [];
  bedTypeGroup: { [key: string]: FormGroup } = {};
  selectedFiles: File[] = []
  id!:string

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _activeRoute: ActivatedRoute,
    private _vendorService: VendorService,
    private _hostelService: HostelService
  ) {
    this.bedTypes.forEach((item) => {
      this.bedTypeGroup[item.type] = this._fb.group({
        price: ['', [Validators.required, Validators.min(1)]],
        quantity:['',[Validators.required,Validators.min(1)]]
      });
    });
    this.hostelForm = this._fb.group({
      name: [
        '',
        [Validators.required, Validators.pattern('^[a-zA-Z]+( [a-zA-Z]+)*$')],
      ],
      phone: ['', [Validators.required, Validators.pattern('^[5-9][0-9]{9}$')]],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$'),
        ],
      ],
      facilities: [[], this.facilityValidator.bind(this)],
      nearByAccess: [[], this.nearByAccessValidator.bind(this)],
      policies: [
        '',
        [Validators.required, Validators.pattern('^[a-zA-Z]+( [a-zA-Z]+)*$')],
      ],
      category: ['', Validators.required],
      advance: ['', [Validators.required, Validators.pattern('^[1-9][0-9]*$')]],
      foodRate: [
        '',
        [Validators.required, Validators.pattern('^[1-9][0-9]*$')],
      ],
      rates: this._fb.group(this.bedTypeGroup),
      photos: [[], [this.mimeTypeValidator(this.photoUrls)]],
    });
  }

  ngOnInit(): void {
    this._activeRoute.queryParams.subscribe((query) => {
      this.id=query['id']
      this.fetchHostel(query['id']);
    });
  }

  fetchHostel(id: string) {
    this._hostelService.getHostel(id).subscribe({
      next: (res) => {
        if (res.success) {
          console.log(res.data);
          const hostel = res.data;
          this.hostelForm.patchValue({
            name: hostel.name,
            phone: hostel.phone,
            email: hostel.email,
            category: hostel.category,
            advance: hostel.advance,
            policies: hostel.policies,
            foodRate: hostel.foodRate,
          });
          this.facilities = [...hostel.facilities];
          this.nearbyPlaces = [...hostel.nearbyPlaces];
          this.photoUrls = hostel.photos;
          this.existingPhotos = hostel.photos;
          hostel.rates.forEach((item: { type: string; price: number ,quantity:number}) => {
            this.bedTypes.push(item);
            this.bedTypeGroup[item.type] = this._fb.group({
              price: [item.price, [Validators.required, Validators.min(1)]],
              quantity:[item.quantity,[Validators.required,Validators.min(1)]]
            });
          });

          this.hostelForm.setControl('rates', this._fb.group(this.bedTypeGroup));
          this.hostelForm.get('facilities')?.updateValueAndValidity();
          this.hostelForm.get('nearByAccess')?.updateValueAndValidity();
        }
      }, error: (error) => {
        Swal.fire({
          position: 'top',
          icon: 'error',
          text: error.error.message || 'Something went wrong',
          showConfirmButton: false,
          timer: 1500,
          toast: true,
        });
      }, complete: () => {


      }
    });
  }

  onSubmit(event: Event) {
    console.log('clicked');
    event.preventDefault()

    if (this.hostelForm.valid) {
      console.log(this.hostelForm.value.rates);

      let formData = new FormData();

      formData = {
        ...this.hostelForm.value,
        facilities:[...this.facilities],
        nearbyPlaces:[ ...this.nearbyPlaces],
        existingPhotos: this.existingPhotos
      };

      this._vendorService.editHostel(formData, this.id).subscribe({
        next: (res) => {
          if (res.success) {
            Swal.fire({
              icon: 'success',
              showConfirmButton: false,
              toast: true,
              timer: 1500,
              position: 'top',
              text:res.message
            })
            this._router.navigate(['/vendor/home'])
          } else {
            Swal.fire({
              icon: 'error',
              showConfirmButton: false,
              toast: true,
              timer: 1500,
              text:res.message
              })
            }
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            showConfirmButton: false,
            toast: true,
            timer: 1500,
            text:err.error.message
            })
        },complete:()=>{}
      })
    }
    this.hostelForm.markAllAsTouched();
    this.checkFormValidity();
  }

  addFecilities() {
    const newFacility = this.hostelForm.get('facilities')?.value;
    if (newFacility) {
      this.facilities.push(newFacility);
      this.hostelForm.get('facilities')?.reset();
      this.hostelForm.get('facilities')?.updateValueAndValidity();
      this.hostelForm.get('facilities')?.setErrors(this.facilityValidator(this.hostelForm.get('facilities')!));
    }
  }
  removeFacility(facility: string) {
    const index = this.facilities.indexOf(facility);
    if (index >= 0) {
      this.facilities.splice(index, 1);
      this.hostelForm.get('facilities')?.updateValueAndValidity();
      this.hostelForm.get('facilities')?.setErrors(this.facilityValidator(this.hostelForm.get('facilities')!));
    }
  }

  addNearAccess() {
    const newPlace = this.hostelForm.get('nearByAccess')?.value;
    if (newPlace) {
      this.nearbyPlaces.push(newPlace);
      this.hostelForm.get('nearByAccess')?.reset();
      this.hostelForm.get('nearByAccess')?.reset();
      this.hostelForm.get('nearByAccess')?.updateValueAndValidity();
      this.hostelForm.get('nearByAccess')?.setErrors(this.nearByAccessValidator(this.hostelForm.get('nearByAccess')!));
    }
  }
  removeNearAcess(item: string) {
    const index = this.nearbyPlaces.indexOf(item);
    if (index >= 0) {
      this.nearbyPlaces.splice(index, 1);
      this.hostelForm.get('nearByAccess')?.reset();
      this.hostelForm.get('nearByAccess')?.updateValueAndValidity();
      this.hostelForm.get('nearByAccess')?.setErrors(this.nearByAccessValidator(this.hostelForm.get('nearByAccess')!));
    }
  }

  facilityValidator(control: AbstractControl): ValidationErrors | null {
    const facilitiesControl = control as FormControl;
    if (this.facilities.length < 1) {
      return { facility: true };
    }
    return null;
  }

  nearByAccessValidator(control: AbstractControl): ValidationErrors | null {
    const nearByAccessControl = control as FormControl;

    if (this.nearbyPlaces.length === 0) {
      return { nearByAccess: true };
    }
    return null;
  }

  checkFormValidity() {
    Object.keys(this.hostelForm.controls).forEach((key) => {
      const control = this.hostelForm.get(key);
      if (control instanceof FormGroup) {
        Object.keys(control.controls).forEach((nestedKey) => {
          const nestedControl = control.get(nestedKey);
          if (nestedControl && nestedControl.invalid) {
            console.log(
              `Field ${nestedKey} in ${key} is invalid:`,
              nestedControl.errors
            );
          }
        });
      } else {
        if (control && control.invalid) {
          console.log(`Field ${key} is invalid:`, control.errors);
        }
      }
    });
  }

  onFileSelect($event: Event) {
    const target = $event.target as HTMLInputElement;
    const files = target.files;

    if (files) {
      Array.from(files).forEach(file => {
        const fileUrl = URL.createObjectURL(file)
        this.photoUrls.push(fileUrl)
        this.selectedFiles.push(file)
      })
      this.hostelForm.patchValue({
        photos: this.selectedFiles
      });

    this.hostelForm.get('photos')?.updateValueAndValidity();
    }
    this.hostelForm.get('photos')?.markAsTouched();
  }
  mimeTypeValidator(existingPhotos: string[]): ValidatorFn  {
    return (control: AbstractControl): ValidationErrors | null => {
      const files = control.value;
      if (files&&Array.isArray(control.value)) {
        const validMimes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
        for (const file of files) {
          if (!validMimes.includes(file.type)) {
            return { mimeType: true };
          }
        }
        const totalFileCount = this.photoUrls.length + files.length;
        if (totalFileCount > 5||totalFileCount<=0) {
          return { exceedLimit: true };
        }
      }
      return null;
    };
  }
  removePhoto(url: string, event: Event) {
    event.preventDefault()
    this.photoUrls = this.photoUrls.filter(item => item !== url)
    this.existingPhotos=this.existingPhotos.filter(item=>item!==url)

    this.selectedFiles = this.selectedFiles.filter(file => URL.createObjectURL(file) === url)

    this.hostelForm.patchValue({
      photos:this.selectedFiles
    })

  }


}
