import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewHostelComponent } from './view-hostel.component';

describe('ViewHostelComponent', () => {
  let component: ViewHostelComponent;
  let fixture: ComponentFixture<ViewHostelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewHostelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewHostelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
