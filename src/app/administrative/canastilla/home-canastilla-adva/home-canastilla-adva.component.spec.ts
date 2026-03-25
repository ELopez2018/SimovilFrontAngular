import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HomeCanastillaAdvaComponent } from './home-canastilla-adva.component';

describe('HomeCanastillaAdvaComponent', () => {
  let component: HomeCanastillaAdvaComponent;
  let fixture: ComponentFixture<HomeCanastillaAdvaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeCanastillaAdvaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeCanastillaAdvaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
