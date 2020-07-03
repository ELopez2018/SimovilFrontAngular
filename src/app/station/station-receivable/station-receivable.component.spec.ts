import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StationReceivableComponent } from './station-receivable.component';

describe('StationReceivableComponent', () => {
  let component: StationReceivableComponent;
  let fixture: ComponentFixture<StationReceivableComponent>;

  beforeEach(async(() => {
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
