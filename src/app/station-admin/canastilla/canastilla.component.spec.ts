import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CanastillaComponent } from './canastilla.component';

describe('CanastillaComponent', () => {
  let component: CanastillaComponent;
  let fixture: ComponentFixture<CanastillaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CanastillaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanastillaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
