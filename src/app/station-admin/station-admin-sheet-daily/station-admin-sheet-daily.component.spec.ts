import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StationAdminSheetDailyComponent } from './station-admin-sheet-daily.component';

describe('StationAdminSheetDailyComponent', () => {
  let component: StationAdminSheetDailyComponent;
  let fixture: ComponentFixture<StationAdminSheetDailyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StationAdminSheetDailyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StationAdminSheetDailyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
