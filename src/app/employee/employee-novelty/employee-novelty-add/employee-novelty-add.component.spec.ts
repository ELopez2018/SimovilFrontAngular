import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeNoveltyAddComponent } from './employee-novelty-add.component';

describe('EmployeeNoveltyAddComponent', () => {
  let component: EmployeeNoveltyAddComponent;
  let fixture: ComponentFixture<EmployeeNoveltyAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeNoveltyAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeNoveltyAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
