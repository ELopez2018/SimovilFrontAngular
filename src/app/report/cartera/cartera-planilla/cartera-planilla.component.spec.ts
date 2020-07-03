import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarteraPlanillaComponent } from './cartera-planilla.component';

describe('CarteraPlanillaComponent', () => {
  let component: CarteraPlanillaComponent;
  let fixture: ComponentFixture<CarteraPlanillaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarteraPlanillaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarteraPlanillaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
