import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CplAdmonComponent } from './cpl-admon.component';

describe('CplAdmonComponent', () => {
  let component: CplAdmonComponent;
  let fixture: ComponentFixture<CplAdmonComponent>;

  beforeEach(waitForAsync(() => {
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
