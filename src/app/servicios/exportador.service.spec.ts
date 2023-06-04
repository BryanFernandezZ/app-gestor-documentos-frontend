import { TestBed } from '@angular/core/testing';

import { ExportadorService } from './exportador.service';

describe('ExportadorService', () => {
  let service: ExportadorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExportadorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
