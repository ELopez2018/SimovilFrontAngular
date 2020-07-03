import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesincorporacionesExitenciaComponent } from './desincorporaciones-exitencia.component';

describe('DesincorporacionesExitenciaComponent', () => {
  let component: DesincorporacionesExitenciaComponent;
  let fixture: ComponentFixture<DesincorporacionesExitenciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesincorporacionesExitenciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesincorporacionesExitenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
