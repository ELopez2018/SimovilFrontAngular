import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CplAdmonComponent } from './cpl-admon.component';

describe('CplAdmonComponent', () => {
  let component: CplAdmonComponent;
  let fixture: ComponentFixture<CplAdmonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CplAdmonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CplAdmonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
