import { TestBed } from '@angular/core/testing';

import { SortElementsGameService } from './sort-elements-game.service';

describe('SortElementsGameService', () => {
  let service: SortElementsGameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SortElementsGameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
