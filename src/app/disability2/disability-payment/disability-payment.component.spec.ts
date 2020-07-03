import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisabilityPaymentComponent } from './disability-payment.component';

describe('DisabilityPaymentComponent', () => {
  let component: DisabilityPaymentComponent;
  let fixture: ComponentFixture<DisabilityPaymentComponent>;

  beforeEach(async(() => {
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
