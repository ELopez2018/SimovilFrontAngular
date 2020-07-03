import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WholesalerInvoicesComponent } from './wholesaler-invoices.component';

describe('WholesalerInvoicesComponent', () => {
  let component: WholesalerInvoicesComponent;
  let fixture: ComponentFixture<WholesalerInvoicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WholesalerInvoicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WholesalerInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
