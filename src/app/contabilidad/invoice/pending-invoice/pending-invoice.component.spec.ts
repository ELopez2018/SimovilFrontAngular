import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PendingInvoiceComponent } from './pending-invoice.component';

describe('PendingInvoiceComponent', () => {
  let component: PendingInvoiceComponent;
  let fixture: ComponentFixture<PendingInvoiceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
