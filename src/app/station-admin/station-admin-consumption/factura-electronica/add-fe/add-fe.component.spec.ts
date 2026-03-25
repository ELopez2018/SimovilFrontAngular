import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFEComponent } from './add-fe.component';

describe('AddFEComponent', () => {
  let component: AddFEComponent;
  let fixture: ComponentFixture<AddFEComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFEComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
