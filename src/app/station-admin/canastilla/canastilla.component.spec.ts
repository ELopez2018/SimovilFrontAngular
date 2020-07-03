import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanastillaComponent } from './canastilla.component';

describe('CanastillaComponent', () => {
  let component: CanastillaComponent;
  let fixture: ComponentFixture<CanastillaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CanastillaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanastillaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
