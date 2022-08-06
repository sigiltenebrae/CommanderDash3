import { TestBed } from '@angular/core/testing';

import { DeckDataService } from './deck-data.service';

describe('DeckDataService', () => {
  let service: DeckDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeckDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
