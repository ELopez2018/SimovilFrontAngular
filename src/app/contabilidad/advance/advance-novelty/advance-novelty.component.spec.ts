import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceNoveltyComponent } from './advance-novelty.component';

describe('AdvanceNoveltyComponent', () => {
  let component: AdvanceNoveltyComponent;
  let fixture: ComponentFixture<AdvanceNoveltyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvanceNoveltyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvanceNoveltyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
