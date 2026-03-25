import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AyudaVisualComponent } from './ayuda-visual.component';

describe('AyudaVisualComponent', () => {
  let component: AyudaVisualComponent;
  let fixture: ComponentFixture<AyudaVisualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AyudaVisualComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AyudaVisualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
