import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PaymentOtherComponent } from './payment-other.component';

describe('PaymentOtherComponent', () => {
  let component: PaymentOtherComponent;
  let fixture: ComponentFixture<PaymentOtherComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentOtherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentOtherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
