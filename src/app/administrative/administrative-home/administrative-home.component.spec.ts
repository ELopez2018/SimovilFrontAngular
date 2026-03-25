import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdministrativeHomeComponent } from './administrative-home.component';

describe('AdministrativeHomeComponent', () => {
  let component: AdministrativeHomeComponent;
  let fixture: ComponentFixture<AdministrativeHomeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdministrativeHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministrativeHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
