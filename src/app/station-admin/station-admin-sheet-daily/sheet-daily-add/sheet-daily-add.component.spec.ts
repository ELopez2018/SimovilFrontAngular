import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetDailyAddComponent } from './sheet-daily-add.component';

describe('SheetDailyAddComponent', () => {
  let component: SheetDailyAddComponent;
  let fixture: ComponentFixture<SheetDailyAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SheetDailyAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SheetDailyAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
