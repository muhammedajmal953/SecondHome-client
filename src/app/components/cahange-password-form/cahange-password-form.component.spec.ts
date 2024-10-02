import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CahangePasswordFormComponent } from './cahange-password-form.component';

describe('CahangePasswordFormComponent', () => {
  let component: CahangePasswordFormComponent;
  let fixture: ComponentFixture<CahangePasswordFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CahangePasswordFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CahangePasswordFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
