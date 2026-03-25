import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PreciosProductosComponent } from './precios-productos.component';

describe('PreciosProductosComponent', () => {
  let component: PreciosProductosComponent;
  let fixture: ComponentFixture<PreciosProductosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PreciosProductosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreciosProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
