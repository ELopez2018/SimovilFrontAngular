import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FechaConsumoComponent } from './fecha-consumo.component';

describe('FechaConsumoComponent', () => {
  let component: FechaConsumoComponent;
  let fixture: ComponentFixture<FechaConsumoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FechaConsumoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FechaConsumoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
