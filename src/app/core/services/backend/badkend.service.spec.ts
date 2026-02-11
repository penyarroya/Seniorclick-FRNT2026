import { TestBed } from '@angular/core/testing';
import { BadkendService } from './backend.service';


describe('BadkendService', () => {
  let service: BadkendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BadkendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
