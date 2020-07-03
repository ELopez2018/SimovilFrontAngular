import { TestBed, async, inject } from '@angular/core/testing';

import { CanDesactivateGuard } from './can-desactivate.guard';

describe('CanDesactivateGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CanDesactivateGuard]
    });
  });

  it('should ...', inject([CanDesactivateGuard], (guard: CanDesactivateGuard) => {
    expect(guard).toBeTruthy();
  }));
});
