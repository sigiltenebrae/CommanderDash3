import { TestBed } from '@angular/core/testing';

import { EdhrecService } from './edhrec.service';

describe('EdhrecService', () => {
  let service: EdhrecService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EdhrecService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
