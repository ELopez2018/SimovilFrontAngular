import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeCPLComponent } from './home-cpl.component';

describe('HomeCPLComponent', () => {
  let component: HomeCPLComponent;
  let fixture: ComponentFixture<HomeCPLComponent>;

  beforeEach(async(() => {
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
