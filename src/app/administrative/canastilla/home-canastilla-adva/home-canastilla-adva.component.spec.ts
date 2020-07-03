import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeCanastillaAdvaComponent } from './home-canastilla-adva.component';

describe('HomeCanastillaAdvaComponent', () => {
  let component: HomeCanastillaAdvaComponent;
  let fixture: ComponentFixture<HomeCanastillaAdvaComponent>;

  beforeEach(async(() => {
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
