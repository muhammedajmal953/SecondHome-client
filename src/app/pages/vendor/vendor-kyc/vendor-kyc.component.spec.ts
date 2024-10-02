import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorKycComponent } from './vendor-kyc.component';

describe('VendorKycComponent', () => {
  let component: VendorKycComponent;
  let fixture: ComponentFixture<VendorKycComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorKycComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorKycComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
