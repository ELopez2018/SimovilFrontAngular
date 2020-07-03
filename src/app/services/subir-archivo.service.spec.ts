import { TestBed, inject } from '@angular/core/testing';

import { SubirArchivoService } from './subir-archivo.service';

describe('SubirArchivoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SubirArchivoService]
    });
  });

  it('should be created', inject([SubirArchivoService], (service: SubirArchivoService) => {
    expect(service).toBeTruthy();
  }));
});
