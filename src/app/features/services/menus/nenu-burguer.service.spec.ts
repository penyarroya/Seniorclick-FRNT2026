import { TestBed } from '@angular/core/testing';

import { NenuBurguerService } from './nenu-burguer.service';

describe('NenuBurguerService', () => {
  let service: NenuBurguerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NenuBurguerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
