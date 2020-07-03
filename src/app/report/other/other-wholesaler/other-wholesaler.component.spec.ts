import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherWholesalerComponent } from './other-wholesaler.component';

describe('OtherWholesalerComponent', () => {
  let component: OtherWholesalerComponent;
  let fixture: ComponentFixture<OtherWholesalerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtherWholesalerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherWholesalerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
