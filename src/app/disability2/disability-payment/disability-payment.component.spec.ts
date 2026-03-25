import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DisabilityPaymentComponent } from './disability-payment.component';

describe('DisabilityPaymentComponent', () => {
  let component: DisabilityPaymentComponent;
  let fixture: ComponentFixture<DisabilityPaymentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DisabilityPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisabilityPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
