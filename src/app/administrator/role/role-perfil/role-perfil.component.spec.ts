import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RolePerfilComponent } from './role-perfil.component';

describe('RolePerfilComponent', () => {
  let component: RolePerfilComponent;
  let fixture: ComponentFixture<RolePerfilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RolePerfilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RolePerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
