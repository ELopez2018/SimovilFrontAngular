import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisabilitySearchComponent } from './disability-search.component';

describe('DisabilitySearchComponent', () => {
  let component: DisabilitySearchComponent;
  let fixture: ComponentFixture<DisabilitySearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisabilitySearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisabilitySearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
