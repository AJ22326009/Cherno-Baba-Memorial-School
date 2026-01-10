import { TestBed } from '@angular/core/testing';

import { ResultService } from './result';

describe('ResultService', () => {
  let service: ResultService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
