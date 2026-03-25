import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValorConsumoComponent } from './valor-consumo.component';

describe('ValorConsumoComponent', () => {
  let component: ValorConsumoComponent;
  let fixture: ComponentFixture<ValorConsumoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValorConsumoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValorConsumoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
