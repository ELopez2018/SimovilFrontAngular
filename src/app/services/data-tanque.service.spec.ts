import { TestBed } from '@angular/core/testing';

import { DataTanqueService } from './data-tanque.service';

describe('DataTanqueService', () => {
  let service: DataTanqueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataTanqueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
