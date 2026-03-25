import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProductosListaGeneralComponent } from './productos-lista-general.component';

describe('ProductosListaGeneralComponent', () => {
  let component: ProductosListaGeneralComponent;
  let fixture: ComponentFixture<ProductosListaGeneralComponent>;

  beforeEach(waitForAsync(() => {
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
