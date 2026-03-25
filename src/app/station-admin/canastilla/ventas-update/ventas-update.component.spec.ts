import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VentasUpdateComponent } from './ventas-update.component';

describe('VentasUpdateComponent', () => {
  let component: VentasUpdateComponent;
  let fixture: ComponentFixture<VentasUpdateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VentasUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentasUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
