import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdvanceHistoryComponent } from './advance-history.component';

describe('AdvanceHistoryComponent', () => {
  let component: AdvanceHistoryComponent;
  let fixture: ComponentFixture<AdvanceHistoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvanceHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvanceHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
