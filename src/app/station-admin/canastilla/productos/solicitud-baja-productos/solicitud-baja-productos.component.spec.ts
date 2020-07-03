import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudBajaProductosComponent } from './solicitud-baja-productos.component';

describe('SolicitudBajaProductosComponent', () => {
  let component: SolicitudBajaProductosComponent;
  let fixture: ComponentFixture<SolicitudBajaProductosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolicitudBajaProductosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudBajaProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
