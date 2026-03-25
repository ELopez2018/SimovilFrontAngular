import { TestBed } from '@angular/core/testing';

import { DataServiceCupoService } from './data-service-cupo.service';

describe('DataServiceCupoService', () => {
  let service: DataServiceCupoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataServiceCupoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
