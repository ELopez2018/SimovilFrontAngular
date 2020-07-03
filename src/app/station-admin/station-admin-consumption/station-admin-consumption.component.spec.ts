import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StationAdminConsumptionComponent } from './station-admin-consumption.component';

describe('StationAdminConsumptionComponent', () => {
  let component: StationAdminConsumptionComponent;
  let fixture: ComponentFixture<StationAdminConsumptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StationAdminConsumptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StationAdminConsumptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
