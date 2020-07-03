import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresoLecturasComponent } from './ingreso-lecturas.component';

describe('IngresoLecturasComponent', () => {
  let component: IngresoLecturasComponent;
  let fixture: ComponentFixture<IngresoLecturasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IngresoLecturasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngresoLecturasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
