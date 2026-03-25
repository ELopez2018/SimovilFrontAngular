import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FiledAddComponent } from './filed-add.component';

describe('FiledAddComponent', () => {
  let component: FiledAddComponent;
  let fixture: ComponentFixture<FiledAddComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FiledAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiledAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
