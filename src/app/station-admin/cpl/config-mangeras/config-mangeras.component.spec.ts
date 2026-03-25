import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConfigMangerasComponent } from './config-mangeras.component';

describe('ConfigMangerasComponent', () => {
  let component: ConfigMangerasComponent;
  let fixture: ComponentFixture<ConfigMangerasComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigMangerasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigMangerasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
