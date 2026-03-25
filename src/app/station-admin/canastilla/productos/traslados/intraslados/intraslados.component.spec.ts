import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IntrasladosComponent } from './intraslados.component';

describe('IntrasladosComponent', () => {
  let component: IntrasladosComponent;
  let fixture: ComponentFixture<IntrasladosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IntrasladosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntrasladosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
