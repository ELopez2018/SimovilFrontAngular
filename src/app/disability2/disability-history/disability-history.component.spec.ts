import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisabilityHistoryComponent } from './disability-history.component';

describe('DisabilityHistoryComponent', () => {
  let component: DisabilityHistoryComponent;
  let fixture: ComponentFixture<DisabilityHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisabilityHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisabilityHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
