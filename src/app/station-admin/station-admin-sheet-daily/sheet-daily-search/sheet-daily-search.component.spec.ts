import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SheetDailySearchComponent } from './sheet-daily-search.component';

describe('SheetDailySearchComponent', () => {
  let component: SheetDailySearchComponent;
  let fixture: ComponentFixture<SheetDailySearchComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SheetDailySearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SheetDailySearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
