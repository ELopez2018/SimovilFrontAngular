import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelTransferComponent } from './fuel-transfer.component';

describe('FuelTransferComponent', () => {
  let component: FuelTransferComponent;
  let fixture: ComponentFixture<FuelTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FuelTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FuelTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
