import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StationAdminCalibrationComponent } from './station-admin-calibration.component';

describe('StationAdminCalibrationComponent', () => {
  let component: StationAdminCalibrationComponent;
  let fixture: ComponentFixture<StationAdminCalibrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StationAdminCalibrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StationAdminCalibrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
