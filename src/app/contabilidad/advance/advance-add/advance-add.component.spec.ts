import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceAddComponent } from './advance-add.component';

describe('AdvanceAddComponent', () => {
  let component: AdvanceAddComponent;
  let fixture: ComponentFixture<AdvanceAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvanceAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvanceAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
