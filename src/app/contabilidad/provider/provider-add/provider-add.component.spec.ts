import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProviderAddComponent } from './provider-add.component';

describe('ProviderAddComponent', () => {
  let component: ProviderAddComponent;
  let fixture: ComponentFixture<ProviderAddComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
