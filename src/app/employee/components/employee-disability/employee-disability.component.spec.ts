import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmployeeDisabilityComponent } from './employee-disability.component';

describe('EmployeeDisabilityComponent', () => {
  let component: EmployeeDisabilityComponent;
  let fixture: ComponentFixture<EmployeeDisabilityComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeDisabilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeDisabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
