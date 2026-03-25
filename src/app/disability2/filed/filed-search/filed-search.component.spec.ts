import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FiledSearchComponent } from './filed-search.component';

describe('FiledSearchComponent', () => {
  let component: FiledSearchComponent;
  let fixture: ComponentFixture<FiledSearchComponent>;

  beforeEach(waitForAsync(() => {
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
