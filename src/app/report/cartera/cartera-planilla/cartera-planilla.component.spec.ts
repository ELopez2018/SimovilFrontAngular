import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CarteraPlanillaComponent } from './cartera-planilla.component';

describe('CarteraPlanillaComponent', () => {
  let component: CarteraPlanillaComponent;
  let fixture: ComponentFixture<CarteraPlanillaComponent>;

  beforeEach(waitForAsync(() => {
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
