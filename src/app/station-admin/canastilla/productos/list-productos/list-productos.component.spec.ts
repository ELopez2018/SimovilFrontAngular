import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListProductosComponent } from './list-productos.component';

describe('ListProductosComponent', () => {
  let component: ListProductosComponent;
  let fixture: ComponentFixture<ListProductosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListProductosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
