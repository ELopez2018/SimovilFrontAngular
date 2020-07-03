import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StationConsumptionReportsComponent } from './station-consumption-reports.component';

describe('StationConsumptionReportsComponent', () => {
  let component: StationConsumptionReportsComponent;
  let fixture: ComponentFixture<StationConsumptionReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StationConsumptionReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StationConsumptionReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
