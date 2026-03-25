import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationConsumptionFLMComponent } from './station-consumption-flm.component';

describe('StationConsumptionFLMComponent', () => {
  let component: StationConsumptionFLMComponent;
  let fixture: ComponentFixture<StationConsumptionFLMComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StationConsumptionFLMComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StationConsumptionFLMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
