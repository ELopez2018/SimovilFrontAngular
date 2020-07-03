import { TestBed, inject } from '@angular/core/testing';

import { SsrsService } from './ssrs.service';

describe('SsrsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SsrsService]
    });
  });

  it('should be created', inject([SsrsService], (service: SsrsService) => {
    expect(service).toBeTruthy();
  }));
});
