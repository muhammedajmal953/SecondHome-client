import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSignOtpComponent } from './user-sign-otp.component';

describe('UserSignOtpComponent', () => {
  let component: UserSignOtpComponent;
  let fixture: ComponentFixture<UserSignOtpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserSignOtpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserSignOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
