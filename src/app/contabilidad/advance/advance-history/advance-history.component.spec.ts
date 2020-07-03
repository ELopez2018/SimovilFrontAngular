import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceHistoryComponent } from './advance-history.component';

describe('AdvanceHistoryComponent', () => {
  let component: AdvanceHistoryComponent;
  let fixture: ComponentFixture<AdvanceHistoryComponent>;

  beforeEach(async(() => {
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
