import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSignForgotChangePassWordComponent } from './user-sign-forgot-change-pass-word.component';

describe('UserSignForgotChangePassWordComponent', () => {
  let component: UserSignForgotChangePassWordComponent;
  let fixture: ComponentFixture<UserSignForgotChangePassWordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserSignForgotChangePassWordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserSignForgotChangePassWordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
