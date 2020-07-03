import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StationAdminComponent } from './station-admin.component';

describe('StationAdminComponent', () => {
  let component: StationAdminComponent;
  let fixture: ComponentFixture<StationAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StationAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StationAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
