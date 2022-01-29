import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidayProfileComponent } from './holiday-profile.component';

describe('HolidayProfileComponent', () => {
  let component: HolidayProfileComponent;
  let fixture: ComponentFixture<HolidayProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HolidayProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HolidayProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
