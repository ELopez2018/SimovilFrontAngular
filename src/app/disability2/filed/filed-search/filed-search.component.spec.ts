import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiledSearchComponent } from './filed-search.component';

describe('FiledSearchComponent', () => {
  let component: FiledSearchComponent;
  let fixture: ComponentFixture<FiledSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiledSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiledSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
