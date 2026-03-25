import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StationReceivableComponent } from './station-receivable.component';

describe('StationReceivableComponent', () => {
  let component: StationReceivableComponent;
  let fixture: ComponentFixture<StationReceivableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StationReceivableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StationReceivableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
