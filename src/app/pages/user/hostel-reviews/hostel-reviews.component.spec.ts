import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostelReviewsComponent } from './hostel-reviews.component';

describe('HostelReviewsComponent', () => {
  let component: HostelReviewsComponent;
  let fixture: ComponentFixture<HostelReviewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostelReviewsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostelReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
