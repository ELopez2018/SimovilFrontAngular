import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuposConsumidosComponent } from './cupos-consumidos.component';

describe('CuposConsumidosComponent', () => {
  let component: CuposConsumidosComponent;
  let fixture: ComponentFixture<CuposConsumidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CuposConsumidosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CuposConsumidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
