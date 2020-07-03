import { TestBed, inject } from '@angular/core/testing';

import { BasicDataService } from './basic-data.service';

describe('BasicDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BasicDataService]
    });
  });

  it('should be created', inject([BasicDataService], (service: BasicDataService) => {
    expect(service).toBeTruthy();
  }));
});
