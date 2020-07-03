import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportLecturasComponent } from './report-lecturas.component';

describe('ReportLecturasComponent', () => {
  let component: ReportLecturasComponent;
  let fixture: ComponentFixture<ReportLecturasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportLecturasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportLecturasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
