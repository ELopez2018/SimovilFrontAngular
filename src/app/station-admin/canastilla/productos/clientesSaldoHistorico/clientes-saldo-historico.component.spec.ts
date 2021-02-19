import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientesSaldoHistoricoComponent } from './clientes-saldo-historico.component';

describe('ClientesSaldoHistoricoComponent', () => {
  let component: ClientesSaldoHistoricoComponent;
  let fixture: ComponentFixture<ClientesSaldoHistoricoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientesSaldoHistoricoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientesSaldoHistoricoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
