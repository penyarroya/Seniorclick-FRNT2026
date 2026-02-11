import { TestBed } from '@angular/core/testing';

import { ResourceFormatterService } from './resource-formatter.service';

describe('ResourceFormatterService', () => {
  let service: ResourceFormatterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResourceFormatterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
