import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaTanqueComponent } from './mapa-tanque.component';

describe('MapaTanqueComponent', () => {
  let component: MapaTanqueComponent;
  let fixture: ComponentFixture<MapaTanqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapaTanqueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapaTanqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
