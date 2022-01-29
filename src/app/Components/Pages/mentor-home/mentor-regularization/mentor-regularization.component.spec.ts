import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorRegularizationComponent } from './mentor-regularization.component';

describe('MentorRegularizationComponent', () => {
  let component: MentorRegularizationComponent;
  let fixture: ComponentFixture<MentorRegularizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MentorRegularizationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MentorRegularizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
