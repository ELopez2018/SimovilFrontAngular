import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesCanastillaComponent } from './reportes-canastilla.component';

describe('ReportesCanastillaComponent', () => {
  let component: ReportesCanastillaComponent;
  let fixture: ComponentFixture<ReportesCanastillaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportesCanastillaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportesCanastillaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
