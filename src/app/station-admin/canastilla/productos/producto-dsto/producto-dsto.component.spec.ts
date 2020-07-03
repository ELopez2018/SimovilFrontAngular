import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductoDstoComponent } from './producto-dsto.component';

describe('ProductoDstoComponent', () => {
  let component: ProductoDstoComponent;
  let fixture: ComponentFixture<ProductoDstoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductoDstoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductoDstoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
