import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PpalCanastillaComponent } from './ppal-canastilla.component';

describe('PpalCanastillaComponent', () => {
  let component: PpalCanastillaComponent;
  let fixture: ComponentFixture<PpalCanastillaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PpalCanastillaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PpalCanastillaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
