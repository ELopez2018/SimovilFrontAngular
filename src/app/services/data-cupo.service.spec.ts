import { TestBed } from '@angular/core/testing';

import { DataCupoService } from './data-cupo.service';

describe('DataCupoService', () => {
  let service: DataCupoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataCupoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
