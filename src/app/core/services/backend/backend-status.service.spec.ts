import { TestBed } from '@angular/core/testing';

import { BackendStatusService } from './backend-status.service';

describe('BackendStatusService', () => {
  let service: BackendStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackendStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
