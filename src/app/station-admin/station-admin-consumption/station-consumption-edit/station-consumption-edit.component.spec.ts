import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StationConsumptionEditComponent } from './station-consumption-edit.component';

describe('StationConsumptionEditComponent', () => {
  let component: StationConsumptionEditComponent;
  let fixture: ComponentFixture<StationConsumptionEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StationConsumptionEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StationConsumptionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
