import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostelCardComponent } from './hostel-card.component';

describe('HostelCardComponent', () => {
  let component: HostelCardComponent;
  let fixture: ComponentFixture<HostelCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostelCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostelCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
