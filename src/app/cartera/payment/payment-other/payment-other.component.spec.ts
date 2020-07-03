import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentOtherComponent } from './payment-other.component';

describe('PaymentOtherComponent', () => {
  let component: PaymentOtherComponent;
  let fixture: ComponentFixture<PaymentOtherComponent>;

  beforeEach(async(() => {
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
