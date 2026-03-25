import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetDailyAddMGComponent } from './sheet-daily-add-mg.component';

describe('SheetDailyAddMGComponent', () => {
  let component: SheetDailyAddMGComponent;
  let fixture: ComponentFixture<SheetDailyAddMGComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SheetDailyAddMGComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SheetDailyAddMGComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
