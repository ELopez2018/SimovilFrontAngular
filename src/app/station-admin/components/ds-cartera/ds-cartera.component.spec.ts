import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DsCarteraComponent } from './ds-cartera.component';

describe('DsCarteraComponent', () => {
  let component: DsCarteraComponent;
  let fixture: ComponentFixture<DsCarteraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DsCarteraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DsCarteraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
