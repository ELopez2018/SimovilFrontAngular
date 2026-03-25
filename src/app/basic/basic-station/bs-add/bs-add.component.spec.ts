import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BsAddComponent } from './bs-add.component';

describe('BsAddComponent', () => {
  let component: BsAddComponent;
  let fixture: ComponentFixture<BsAddComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BsAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
