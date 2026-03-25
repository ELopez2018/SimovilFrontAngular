import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DisabilityHistoryComponent } from './disability-history.component';

describe('DisabilityHistoryComponent', () => {
  let component: DisabilityHistoryComponent;
  let fixture: ComponentFixture<DisabilityHistoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DisabilityHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisabilityHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
