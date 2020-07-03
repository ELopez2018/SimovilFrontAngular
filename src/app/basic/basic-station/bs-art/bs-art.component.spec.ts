import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BsArtComponent } from './bs-art.component';

describe('BsArtComponent', () => {
  let component: BsArtComponent;
  let fixture: ComponentFixture<BsArtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BsArtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BsArtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
