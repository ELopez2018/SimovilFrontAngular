import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BsEditComponent } from './bs-edit.component';

describe('BsEditComponent', () => {
  let component: BsEditComponent;
  let fixture: ComponentFixture<BsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BsEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
