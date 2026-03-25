import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNCEComponent } from './add-nce.component';

describe('AddNCEComponent', () => {
  let component: AddNCEComponent;
  let fixture: ComponentFixture<AddNCEComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNCEComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNCEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
