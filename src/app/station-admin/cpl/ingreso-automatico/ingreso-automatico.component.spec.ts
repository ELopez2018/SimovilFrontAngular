import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresoAutomaticoComponent } from './ingreso-automatico.component';

describe('IngresoAutomaticoComponent', () => {
  let component: IngresoAutomaticoComponent;
  let fixture: ComponentFixture<IngresoAutomaticoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IngresoAutomaticoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IngresoAutomaticoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
