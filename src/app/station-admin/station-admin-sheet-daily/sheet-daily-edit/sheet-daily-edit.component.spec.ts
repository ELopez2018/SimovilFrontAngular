import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SheetDailyEditComponent } from './sheet-daily-edit.component';

describe('SheetDailyEditComponent', () => {
  let component: SheetDailyEditComponent;
  let fixture: ComponentFixture<SheetDailyEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SheetDailyEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SheetDailyEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
