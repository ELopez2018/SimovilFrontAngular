import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentAssignComponent } from './payment-assign.component';

describe('PaymentAssignComponent', () => {
  let component: PaymentAssignComponent;
  let fixture: ComponentFixture<PaymentAssignComponent>;

  beforeEach(async(() => {
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
