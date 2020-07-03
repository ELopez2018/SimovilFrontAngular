import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StationClientComponent } from './station-client.component';

describe('StationClientComponent', () => {
  let component: StationClientComponent;
  let fixture: ComponentFixture<StationClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StationClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StationClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
