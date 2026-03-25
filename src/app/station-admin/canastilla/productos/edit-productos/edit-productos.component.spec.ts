import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditProductosComponent } from './edit-productos.component';

describe('EditProductosComponent', () => {
  let component: EditProductosComponent;
  let fixture: ComponentFixture<EditProductosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditProductosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
