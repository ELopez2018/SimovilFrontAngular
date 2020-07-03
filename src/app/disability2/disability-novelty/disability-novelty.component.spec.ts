import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisabilityNoveltyComponent } from './disability-novelty.component';

describe('DisabilityNoveltyComponent', () => {
  let component: DisabilityNoveltyComponent;
  let fixture: ComponentFixture<DisabilityNoveltyComponent>;

  beforeEach(async(() => {
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
