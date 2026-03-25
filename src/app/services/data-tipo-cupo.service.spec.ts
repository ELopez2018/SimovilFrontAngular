import { TestBed } from '@angular/core/testing';

import { DataTipoCupoService } from './data-tipo-cupo.service';

describe('DataTipoCupoService', () => {
  let service: DataTipoCupoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataTipoCupoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
