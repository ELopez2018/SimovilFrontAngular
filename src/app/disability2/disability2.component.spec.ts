import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Disability2Component } from './disability2.component';

describe('Disability2Component', () => {
  let component: Disability2Component;
  let fixture: ComponentFixture<Disability2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Disability2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Disability2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
