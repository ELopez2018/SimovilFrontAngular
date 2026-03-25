import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TanquesEdsComponent } from './tanques-eds.component';

describe('TanquesEdsComponent', () => {
  let component: TanquesEdsComponent;
  let fixture: ComponentFixture<TanquesEdsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TanquesEdsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TanquesEdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
