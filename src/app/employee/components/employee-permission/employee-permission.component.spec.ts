import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmployeePermissionComponent } from './employee-permission.component';

describe('EmployeePermissionComponent', () => {
  let component: EmployeePermissionComponent;
  let fixture: ComponentFixture<EmployeePermissionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeePermissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeePermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
