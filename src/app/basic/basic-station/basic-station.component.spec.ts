import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicStationComponent } from './basic-station.component';

describe('BasicStationComponent', () => {
  let component: BasicStationComponent;
  let fixture: ComponentFixture<BasicStationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicStationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicStationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
