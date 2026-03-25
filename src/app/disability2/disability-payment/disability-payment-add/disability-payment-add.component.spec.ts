import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DisabilityPaymentAddComponent } from './disability-payment-add.component';

describe('DisabilityPaymentAddComponent', () => {
  let component: DisabilityPaymentAddComponent;
  let fixture: ComponentFixture<DisabilityPaymentAddComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DisabilityPaymentAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisabilityPaymentAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
