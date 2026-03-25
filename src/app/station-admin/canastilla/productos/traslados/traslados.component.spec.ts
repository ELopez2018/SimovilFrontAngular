import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TrasladosComponent } from './traslados.component';

describe('TrasladosComponent', () => {
  let component: TrasladosComponent;
  let fixture: ComponentFixture<TrasladosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TrasladosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrasladosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
