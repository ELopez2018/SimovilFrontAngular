import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BsEditComponent } from './bs-edit.component';

describe('BsEditComponent', () => {
  let component: BsEditComponent;
  let fixture: ComponentFixture<BsEditComponent>;

  beforeEach(waitForAsync(() => {
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
