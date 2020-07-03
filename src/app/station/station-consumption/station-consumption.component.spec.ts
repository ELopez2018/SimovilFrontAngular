import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StationConsumptionComponent } from './station-consumption.component';

describe('StationConsumptionComponent', () => {
  let component: StationConsumptionComponent;
  let fixture: ComponentFixture<StationConsumptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StationConsumptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StationConsumptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
