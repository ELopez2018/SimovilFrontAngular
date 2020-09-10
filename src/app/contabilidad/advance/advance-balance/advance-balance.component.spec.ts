import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceBalanceComponent } from './advance-balance.component';

describe('AdvanceBalanceComponent', () => {
  let component: AdvanceBalanceComponent;
  let fixture: ComponentFixture<AdvanceBalanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvanceBalanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvanceBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
