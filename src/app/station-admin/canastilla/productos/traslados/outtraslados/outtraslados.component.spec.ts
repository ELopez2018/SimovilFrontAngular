import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OuttrasladosComponent } from './outtraslados.component';

describe('OuttrasladosComponent', () => {
  let component: OuttrasladosComponent;
  let fixture: ComponentFixture<OuttrasladosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OuttrasladosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OuttrasladosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
