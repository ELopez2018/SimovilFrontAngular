import { TestBed, inject } from '@angular/core/testing';

import { UtilService } from './util.service';

describe('ConfirmDialogService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UtilService]
    });
  });

  it('should be created', inject([UtilService], (service: UtilService) => {
    expect(service).toBeTruthy();
  }));
});
