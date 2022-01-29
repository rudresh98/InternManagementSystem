import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternAttendanceComponent } from './intern-attendance.component';

describe('InternAttendanceComponent', () => {
  let component: InternAttendanceComponent;
  let fixture: ComponentFixture<InternAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternAttendanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InternAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
