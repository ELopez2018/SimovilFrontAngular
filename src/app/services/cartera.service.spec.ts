import { TestBed, inject } from '@angular/core/testing';

import { CarteraService } from './cartera.service';

describe('CarteraService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CarteraService]
    });
  });

  it('should be created', inject([CarteraService], (service: CarteraService) => {
    expect(service).toBeTruthy();
  }));
});
