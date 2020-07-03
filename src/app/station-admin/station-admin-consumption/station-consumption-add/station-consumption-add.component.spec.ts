import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StationConsumptionAddComponent } from './station-consumption-add.component';

describe('StationConsumptionAddComponent', () => {
  let component: StationConsumptionAddComponent;
  let fixture: ComponentFixture<StationConsumptionAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StationConsumptionAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StationConsumptionAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
