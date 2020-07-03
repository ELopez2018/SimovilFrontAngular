import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionEditComponent } from './option-edit.component';

describe('OptionEditComponent', () => {
  let component: OptionEditComponent;
  let fixture: ComponentFixture<OptionEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptionEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
