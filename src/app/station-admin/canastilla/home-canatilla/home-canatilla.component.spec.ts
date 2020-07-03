import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeCanatillaComponent } from './home-canatilla.component';

describe('HomeCanatillaComponent', () => {
  let component: HomeCanatillaComponent;
  let fixture: ComponentFixture<HomeCanatillaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeCanatillaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeCanatillaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
