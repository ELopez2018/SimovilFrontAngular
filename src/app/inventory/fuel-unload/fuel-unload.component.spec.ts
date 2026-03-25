import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FuelUnloadComponent } from './fuel-unload.component';

describe('FuelUnloadComponent', () => {
  let component: FuelUnloadComponent;
  let fixture: ComponentFixture<FuelUnloadComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FuelUnloadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FuelUnloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
