/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { StationConsumptionFormapagoComponent } from './stationConsumptionFormapago.component';

describe('StationConsumptionFormapagoComponent', () => {
  let component: StationConsumptionFormapagoComponent;
  let fixture: ComponentFixture<StationConsumptionFormapagoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StationConsumptionFormapagoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StationConsumptionFormapagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
