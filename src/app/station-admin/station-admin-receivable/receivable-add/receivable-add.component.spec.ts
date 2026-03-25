import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReceivableAddComponent } from './receivable-add.component';

describe('ReceivableAddComponent', () => {
  let component: ReceivableAddComponent;
  let fixture: ComponentFixture<ReceivableAddComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceivableAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivableAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
