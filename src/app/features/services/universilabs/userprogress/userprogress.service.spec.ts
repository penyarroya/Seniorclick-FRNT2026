import { TestBed } from '@angular/core/testing';

import { UserprogressService } from './userprogress.service';

describe('UserprogressService', () => {
  let service: UserprogressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserprogressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
