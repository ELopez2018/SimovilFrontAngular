import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InvoiceImportComponent } from './invoice-import.component';

describe('InvoiceImportComponent', () => {
  let component: InvoiceImportComponent;
  let fixture: ComponentFixture<InvoiceImportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
