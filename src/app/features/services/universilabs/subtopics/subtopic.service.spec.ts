import { TestBed } from '@angular/core/testing';

import { SubtopicService } from './subtopic.service';

describe('SubtopicService', () => {
  let service: SubtopicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubtopicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
