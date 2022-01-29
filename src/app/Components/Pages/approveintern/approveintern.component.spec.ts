import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveinternComponent } from './approveintern.component';

describe('ApproveinternComponent', () => {
  let component: ApproveinternComponent;
  let fixture: ComponentFixture<ApproveinternComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveinternComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveinternComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
