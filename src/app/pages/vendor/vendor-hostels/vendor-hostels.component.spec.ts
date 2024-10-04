import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorHostelsComponent } from './vendor-hostels.component';

describe('VendorHostelsComponent', () => {
  let component: VendorHostelsComponent;
  let fixture: ComponentFixture<VendorHostelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorHostelsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorHostelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
