import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceNoveltyComponent } from './invoice-novelty.component';

describe('InvoiceNoveltyComponent', () => {
  let component: InvoiceNoveltyComponent;
  let fixture: ComponentFixture<InvoiceNoveltyComponent>;

  beforeEach(async(() => {
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
