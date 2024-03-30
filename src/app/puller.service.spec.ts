import { TestBed } from '@angular/core/testing';

import { PullerService } from './puller.service';

describe('PullerService', () => {
  let service: PullerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PullerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
