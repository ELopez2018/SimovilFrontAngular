import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformesRHComponent } from './informes-rh.component';

describe('InformesRHComponent', () => {
  let component: InformesRHComponent;
  let fixture: ComponentFixture<InformesRHComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InformesRHComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformesRHComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
