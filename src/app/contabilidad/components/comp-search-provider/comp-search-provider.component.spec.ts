import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CompSearchProviderComponent } from './comp-search-provider.component';

describe('CompSearchProviderComponent', () => {
  let component: CompSearchProviderComponent;
  let fixture: ComponentFixture<CompSearchProviderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CompSearchProviderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompSearchProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
