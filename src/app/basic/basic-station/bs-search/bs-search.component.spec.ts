import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BsSearchComponent } from './bs-search.component';

describe('BsSearchComponent', () => {
  let component: BsSearchComponent;
  let fixture: ComponentFixture<BsSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BsSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BsSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
