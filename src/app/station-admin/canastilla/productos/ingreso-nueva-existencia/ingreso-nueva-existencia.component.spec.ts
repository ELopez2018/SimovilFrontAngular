import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IngresoNuevaExistenciaComponent } from './ingreso-nueva-existencia.component';

describe('IngresoNuevaExistenciaComponent', () => {
  let component: IngresoNuevaExistenciaComponent;
  let fixture: ComponentFixture<IngresoNuevaExistenciaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IngresoNuevaExistenciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngresoNuevaExistenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
