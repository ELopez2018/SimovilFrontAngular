import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCodigoEditComponent } from './product-codigo-edit.component';

describe('ProductCodigoEditComponent', () => {
  let component: ProductCodigoEditComponent;
  let fixture: ComponentFixture<ProductCodigoEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductCodigoEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCodigoEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
