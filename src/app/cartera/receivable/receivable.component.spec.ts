import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReceivableComponent } from './receivable.component';

describe('ReceivableComponent', () => {
  let component: ReceivableComponent;
  let fixture: ComponentFixture<ReceivableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceivableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
