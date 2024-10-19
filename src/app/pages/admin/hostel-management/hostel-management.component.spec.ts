import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostelManagementComponent } from './hostel-management.component';

describe('HostelManagementComponent', () => {
  let component: HostelManagementComponent;
  let fixture: ComponentFixture<HostelManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostelManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostelManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
