import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StationConsumptionSearchComponent } from './station-consumption-search.component';

describe('StationConsumptionSearchComponent', () => {
  let component: StationConsumptionSearchComponent;
  let fixture: ComponentFixture<StationConsumptionSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StationConsumptionSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StationConsumptionSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
