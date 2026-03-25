import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FechaPagoComponent } from './fecha-pago.component';

describe('FechaPagoComponent', () => {
  let component: FechaPagoComponent;
  let fixture: ComponentFixture<FechaPagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FechaPagoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FechaPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
