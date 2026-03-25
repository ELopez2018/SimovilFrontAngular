import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HomeCPLComponent } from './home-cpl.component';

describe('HomeCPLComponent', () => {
  let component: HomeCPLComponent;
  let fixture: ComponentFixture<HomeCPLComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeCPLComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeCPLComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
