import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiledUpdateComponent } from './filed-update.component';

describe('FiledUpdateComponent', () => {
  let component: FiledUpdateComponent;
  let fixture: ComponentFixture<FiledUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiledUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiledUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
