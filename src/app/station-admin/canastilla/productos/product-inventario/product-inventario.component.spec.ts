import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductInventarioComponent } from './product-inventario.component';

describe('ProductInventarioComponent', () => {
  let component: ProductInventarioComponent;
  let fixture: ComponentFixture<ProductInventarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductInventarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductInventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
