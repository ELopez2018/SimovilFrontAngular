import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RolePerfilComponent } from './role-perfil.component';

describe('RolePerfilComponent', () => {
  let component: RolePerfilComponent;
  let fixture: ComponentFixture<RolePerfilComponent>;

  beforeEach(waitForAsync(() => {
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
