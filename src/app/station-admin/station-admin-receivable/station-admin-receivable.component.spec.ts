import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StationAdminReceivableComponent } from './station-admin-receivable.component';

describe('StationAdminReceivableComponent', () => {
  let component: StationAdminReceivableComponent;
  let fixture: ComponentFixture<StationAdminReceivableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StationAdminReceivableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StationAdminReceivableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
