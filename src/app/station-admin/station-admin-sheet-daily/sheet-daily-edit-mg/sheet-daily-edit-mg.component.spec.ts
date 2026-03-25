import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetDailyEditMGComponent } from './sheet-daily-edit-mg.component';

describe('SheetDailyEditMGComponent', () => {
  let component: SheetDailyEditMGComponent;
  let fixture: ComponentFixture<SheetDailyEditMGComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SheetDailyEditMGComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SheetDailyEditMGComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
