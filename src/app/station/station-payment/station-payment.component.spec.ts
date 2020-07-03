import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StationPaymentComponent } from './station-payment.component';

describe('StationPaymentComponent', () => {
  let component: StationPaymentComponent;
  let fixture: ComponentFixture<StationPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StationPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StationPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
