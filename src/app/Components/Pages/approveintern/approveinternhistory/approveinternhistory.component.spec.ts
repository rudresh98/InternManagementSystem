import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveinternhistoryComponent } from './approveinternhistory.component';

describe('ApproveinternhistoryComponent', () => {
  let component: ApproveinternhistoryComponent;
  let fixture: ComponentFixture<ApproveinternhistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveinternhistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveinternhistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
