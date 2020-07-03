import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogorderComponent } from './logorder.component';

describe('LogorderComponent', () => {
  let component: LogorderComponent;
  let fixture: ComponentFixture<LogorderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogorderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
