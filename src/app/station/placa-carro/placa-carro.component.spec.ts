import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacaCarroComponent } from './placa-carro.component';

describe('PlacaCarroComponent', () => {
  let component: PlacaCarroComponent;
  let fixture: ComponentFixture<PlacaCarroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlacaCarroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlacaCarroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
