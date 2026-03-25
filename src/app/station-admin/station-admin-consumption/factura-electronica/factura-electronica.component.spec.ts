import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturaElectronicaComponent } from './factura-electronica.component';

describe('FacturaElectronicaComponent', () => {
  let component: FacturaElectronicaComponent;
  let fixture: ComponentFixture<FacturaElectronicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacturaElectronicaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturaElectronicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
