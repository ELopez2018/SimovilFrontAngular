import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TanquesLiqComponent } from './tanques-liq.component';

describe('TanquesLiqComponent', () => {
  let component: TanquesLiqComponent;
  let fixture: ComponentFixture<TanquesLiqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TanquesLiqComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TanquesLiqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
