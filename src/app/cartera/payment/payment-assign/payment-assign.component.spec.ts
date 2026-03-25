import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PaymentAssignComponent } from './payment-assign.component';

describe('PaymentAssignComponent', () => {
  let component: PaymentAssignComponent;
  let fixture: ComponentFixture<PaymentAssignComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentAssignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
