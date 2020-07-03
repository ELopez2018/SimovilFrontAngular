import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeDisabilityComponent } from './employee-disability.component';

describe('EmployeeDisabilityComponent', () => {
  let component: EmployeeDisabilityComponent;
  let fixture: ComponentFixture<EmployeeDisabilityComponent>;

  beforeEach(async(() => {
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
