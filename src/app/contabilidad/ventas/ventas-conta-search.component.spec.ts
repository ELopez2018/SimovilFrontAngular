import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasContaSearchComponent } from './ventas-conta-search.component';

describe('VentasContaSearchComponent', () => {
  let component: VentasContaSearchComponent;
  let fixture: ComponentFixture<VentasContaSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VentasContaSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VentasContaSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
