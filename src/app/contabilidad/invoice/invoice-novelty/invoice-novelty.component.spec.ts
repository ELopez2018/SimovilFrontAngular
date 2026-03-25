import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InvoiceNoveltyComponent } from './invoice-novelty.component';

describe('InvoiceNoveltyComponent', () => {
  let component: InvoiceNoveltyComponent;
  let fixture: ComponentFixture<InvoiceNoveltyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceNoveltyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceNoveltyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
