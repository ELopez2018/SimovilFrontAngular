import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLecturasComponent } from './edit-lecturas.component';

describe('EditLecturasComponent', () => {
  let component: EditLecturasComponent;
  let fixture: ComponentFixture<EditLecturasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditLecturasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLecturasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
