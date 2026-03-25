import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmployeeNoveltySearchComponent } from './employee-novelty-search.component';

describe('EmployeeNoveltySearchComponent', () => {
  let component: EmployeeNoveltySearchComponent;
  let fixture: ComponentFixture<EmployeeNoveltySearchComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeNoveltySearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeNoveltySearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
