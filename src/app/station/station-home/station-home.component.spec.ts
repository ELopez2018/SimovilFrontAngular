import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StationHomeComponent } from './station-home.component';

describe('StationHomeComponent', () => {
  let component: StationHomeComponent;
  let fixture: ComponentFixture<StationHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StationHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StationHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
