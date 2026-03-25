import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DisabilityPaymentEditComponent } from './disability-payment-edit.component';

describe('DisabilityPaymentEditComponent', () => {
  let component: DisabilityPaymentEditComponent;
  let fixture: ComponentFixture<DisabilityPaymentEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DisabilityPaymentEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisabilityPaymentEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
