import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSignForgotPassWordComponent } from './user-sign-forgot-pass-word.component';

describe('UserSignForgotPassWordComponent', () => {
  let component: UserSignForgotPassWordComponent;
  let fixture: ComponentFixture<UserSignForgotPassWordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserSignForgotPassWordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserSignForgotPassWordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
