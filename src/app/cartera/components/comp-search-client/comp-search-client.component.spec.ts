import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompSearchClientComponent } from './comp-search-client.component';

describe('CompSearchClientComponent', () => {
  let component: CompSearchClientComponent;
  let fixture: ComponentFixture<CompSearchClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompSearchClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompSearchClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
