import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DisabilityNoveltyComponent } from './disability-novelty.component';

describe('DisabilityNoveltyComponent', () => {
  let component: DisabilityNoveltyComponent;
  let fixture: ComponentFixture<DisabilityNoveltyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DisabilityNoveltyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisabilityNoveltyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
