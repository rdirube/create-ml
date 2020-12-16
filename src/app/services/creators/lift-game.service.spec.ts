import { TestBed } from '@angular/core/testing';

import { LiftGameService } from './lift-game.service';

describe('LiftGameService', () => {
  let service: LiftGameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LiftGameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
