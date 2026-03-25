import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BasicStationComponent } from './basic-station.component';

describe('BasicStationComponent', () => {
  let component: BasicStationComponent;
  let fixture: ComponentFixture<BasicStationComponent>;

  beforeEach(waitForAsync(() => {
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
