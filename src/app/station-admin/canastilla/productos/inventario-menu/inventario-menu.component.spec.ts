import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventarioMenuComponent } from './inventario-menu.component';

describe('InventarioMenuComponent', () => {
  let component: InventarioMenuComponent;
  let fixture: ComponentFixture<InventarioMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventarioMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventarioMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
