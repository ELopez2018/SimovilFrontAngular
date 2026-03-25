import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DsCarteraComponent } from './ds-cartera.component';

describe('DsCarteraComponent', () => {
  let component: DsCarteraComponent;
  let fixture: ComponentFixture<DsCarteraComponent>;

  beforeEach(waitForAsync(() => {
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
