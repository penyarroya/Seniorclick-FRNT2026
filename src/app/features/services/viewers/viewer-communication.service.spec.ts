import { TestBed } from '@angular/core/testing';

import { ViewerCommunicationService } from './viewer-communication.service';

describe('ViewerCommunicationService', () => {
  let service: ViewerCommunicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewerCommunicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
