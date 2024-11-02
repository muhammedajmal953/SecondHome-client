import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { log } from 'console';
import { Subscription } from 'rxjs';
import { ChipsModule } from 'primeng/chips';
import { Router } from '@angular/router';
import { patters } from '../../../shared/constants/regexConstants';

@Component({
  selector: 'app-add-hostel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ChipsModule, FormsModule],
  templateUrl: './add-hostel.component.html',
  styleUrl: './add-hostel.component.css',
})
export class AddHostelComponent {
  facilities: string[] = [];
  bedTypes: string[] = ['Private', '2 share', '4 share', '6 share'];
  nearbyPlaces: string[] = [];
  categories: string[] = ['MEN', 'WOMEN', 'MIXED'];
  hostelForm: FormGroup;

  constructor(private _fb: FormBuilder, private _router: Router) {
    this.hostelForm = this._fb.group({
      name: [
        '',
        [Validators.required, Validators.pattern(patters.TEXT_CONTENT)],
      ],
      phone: ['', [Validators.required, Validators.pattern(patters.PHONE)]],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(patters.EMAIL),
        ],
      ],
      facilities: ['', this.facilityValidator.bind(this)],
      noOfBedsPerRoom: this._fb.group(
        {
          'Private':[false],
          '2 share': [false],
          '4 share': [false],
          '6 share': [false],
        },
        {
          validator: this.atLeastOneCheckboxSelected,
        }
      ),
      nearByAccess: ['', this.nearByAccessValidator.bind(this)],
      policies: [
        '',
        [Validators.required, Validators.pattern(patters.TEXT_CONTENT)],
      ],
      category: ['', Validators.required],
      advance: ['', [Validators.required, Validators.pattern(patters.TEXT_CONTENT)]],
    });
  }

  onSubmit(event: Event) {
    console.log('clicked');

    if (this.hostelForm.valid) {
      let formData = new FormData();

      formData = {
        ...this.hostelForm.value,
        facilities: this.facilities,
        nearbyPlaces: this.nearbyPlaces,
        selectedBedTypes: this.getSelectedBedTypes(),
      };

      localStorage.setItem('hostelForm1', JSON.stringify(formData));
      this._router.navigate(['/vendor/home/add-hostel2']);
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
    }
  }
  removeFacility(facility: string) {
    const index = this.facilities.indexOf(facility);
    if (index >= 0) {
      this.facilities.splice(index, 1);
    }
  }

  addNearAccess() {
    const newPlace = this.hostelForm.get('nearByAccess')?.value;
    if (newPlace) {
      this.nearbyPlaces.push(newPlace);
      this.hostelForm.get('nearByAccess')?.reset();
    }
  }
  removeNearAcess(item: string) {
    const index = this.nearbyPlaces.indexOf(item);
    if (index >= 0) {
      this.nearbyPlaces.splice(index, 1);
    }
  }

  facilityValidator(control: FormControl): ValidationErrors | null {
    if (this.facilities.length === 0) {
      return { facility: true };
    }
    return null;
  }

  nearByAccessValidator(control: FormControl): ValidationErrors | null {
    if (this.nearbyPlaces.length === 0) {
      return { nearByAccess: true };
    }
    return null;
  }

  atLeastOneCheckboxSelected(
    control: AbstractControl
  ): { [key: string]: any } | null {
    const checkboxes = control as FormGroup;
    const selectedCount = Object.values(checkboxes.value).filter(
      (value) => value === true
    ).length;
    return selectedCount > 0 ? null : { noCheckboxSelected: true };
  }

  getSelectedBedTypes(): string[] {
    const bedTypesControl = this.hostelForm.get('noOfBedsPerRoom') as FormGroup;
    return Object.entries(bedTypesControl.value)
      .filter(([key, value]) => value)
      .map(([key]) => key);
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
}
