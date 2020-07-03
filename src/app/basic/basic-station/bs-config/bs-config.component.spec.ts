import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BsConfigComponent } from './bs-config.component';

describe('BsConfigComponent', () => {
  let component: BsConfigComponent;
  let fixture: ComponentFixture<BsConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BsConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BsConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
