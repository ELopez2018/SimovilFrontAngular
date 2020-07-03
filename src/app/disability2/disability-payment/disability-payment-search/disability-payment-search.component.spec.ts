import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisabilityPaymentSearchComponent } from './disability-payment-search.component';

describe('DisabilityPaymentSearchComponent', () => {
  let component: DisabilityPaymentSearchComponent;
  let fixture: ComponentFixture<DisabilityPaymentSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisabilityPaymentSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisabilityPaymentSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
