import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DisabilityPendingComponent } from './disability-pending.component';

describe('DisabilityPendingComponent', () => {
  let component: DisabilityPendingComponent;
  let fixture: ComponentFixture<DisabilityPendingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DisabilityPendingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisabilityPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
