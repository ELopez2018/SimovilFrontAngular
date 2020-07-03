import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientSelfComponent } from './client-self.component';

describe('ClientSelfComponent', () => {
  let component: ClientSelfComponent;
  let fixture: ComponentFixture<ClientSelfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientSelfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientSelfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
