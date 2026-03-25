import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReportSSRSComponent } from './report-ssrs.component';

describe('ReportSSRSComponent', () => {
  let component: ReportSSRSComponent;
  let fixture: ComponentFixture<ReportSSRSComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportSSRSComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportSSRSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
