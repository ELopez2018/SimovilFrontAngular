import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosListaGeneralComponent } from './productos-lista-general.component';

describe('ProductosListaGeneralComponent', () => {
  let component: ProductosListaGeneralComponent;
  let fixture: ComponentFixture<ProductosListaGeneralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductosListaGeneralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductosListaGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
