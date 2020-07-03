import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeNoveltyComponent } from './employee-novelty.component';

describe('EmployeeNoveltyComponent', () => {
  let component: EmployeeNoveltyComponent;
  let fixture: ComponentFixture<EmployeeNoveltyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeNoveltyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeNoveltyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
