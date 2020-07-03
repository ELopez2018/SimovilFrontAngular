import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListProductosComponent } from './list-productos.component';

describe('ListProductosComponent', () => {
  let component: ListProductosComponent;
  let fixture: ComponentFixture<ListProductosComponent>;

  beforeEach(async(() => {
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
