import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidaymanagementComponent } from './holidaymanagement.component';

describe('HolidaymanagementComponent', () => {
  let component: HolidaymanagementComponent;
  let fixture: ComponentFixture<HolidaymanagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HolidaymanagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HolidaymanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
