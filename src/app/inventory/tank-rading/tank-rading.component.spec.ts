import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TankRadingComponent } from './tank-rading.component';

describe('TankRadingComponent', () => {
  let component: TankRadingComponent;
  let fixture: ComponentFixture<TankRadingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TankRadingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TankRadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
